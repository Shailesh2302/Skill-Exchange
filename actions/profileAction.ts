"use server";

import prisma from "@/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/options";
import { revalidatePath } from "next/cache";

// Helper function to get current user ID from session
async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function addBio(bio: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("User not found");
    }

    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        bio: bio,
      },
    });

    revalidatePath("/profile");
    return result;
  } catch (error) {
    console.error("Failed to update bio:", error);
    throw error;
  }
}

export async function addSkill(skillName: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("User not found");
    }

    // 1. Find or Create the Skill
    const skill = await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName },
    });

    // 2. Link User ↔ Skill (upsert ensures no duplicate)
    const result = await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: userId,
          skillId: skill.id,
        },
      },
      update: {}, // do nothing if exists
      create: {
        userId: userId,
        skillId: skill.id,
      },
    });

    console.log(`Skill "${skillName}" added successfully.`);
    revalidatePath("/profile");
    return result;
  } catch (error) {
    console.error("Failed to add skill:", error);
    throw error;
  }
}

export async function getUserSkills() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("User not found");
    }

    const userWithSkills = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return (
      userWithSkills?.skills.map((userSkill) => userSkill.skill.name) || []
    );
  } catch (error) {
    console.error("Failed to get user skills:", error);
    throw error;
  }
}

export default async function statusChange(status: boolean) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: status, // Fixed: use the parameter instead of hardcoded true
      },
    });

    revalidatePath("/profile");
  } catch (error) {
    throw error;
  }
}
