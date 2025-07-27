"use server";

import prisma from "@/db/prisma";
import axios from "axios";

export default async function verifyCodeAction(_: unknown, formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const code = formData.get("code") as string;

    if (!username || !code) {
      return { success: false, message: "Username and Code are required" };
    }
    const decodedUsername = decodeURIComponent(username);

    const user = await prisma.user.findFirst({
      where: {
        username: decodedUsername,
      },
      select: {
        verifyCode: true,
      },
    });

    if (!user || !user?.verifyCode) {
      throw new Error("Username or Verification code not found");
    }

    if (code == user?.verifyCode) {
      await prisma.user.update({
        where: {
          username,
        },
        data: {
          isVerified: true,
        },
      });
      return { success: true, message: "Verifiaction Successfull" };
    } else {
      return { success: false, message: "Verifiaction Unccessfull" };
    }
  } catch (error: any) {
    console.error("Axios Error:", error?.response?.data || error.message);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    return { success: false, message: errorMsg };
  }
}
