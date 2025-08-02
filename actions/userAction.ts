"use server";

import prisma from "@/db/prisma";
import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth";

export default async function getUserAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Unauthorized error");
    }

    const userId = session.user.id; // Remove await and optional chaining

    const result = await prisma.user.findUnique({
      // Use findUnique instead of findFirst
      where: {
        id: userId,
      },
      select: {
        // Optional: select only needed fields
        id: true,
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
        status: true,
        lastSeen: true,
        isVerified: true,
        isAcceptingMessages: true,
        createdAt: true,
      },
    });

    if (!result) {
      throw new Error("User not found");
    }

    return result;
  } catch (error) {
    console.error("Failed to get user:", error);
    throw error;
  }
}
