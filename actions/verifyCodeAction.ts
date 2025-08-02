"use server";

import prisma from "@/db/prisma";

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
  } catch (error: unknown) {
    let errorMsg = "Something went wrong";

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMsg = axiosError.response?.data?.message || "Something went wrong";
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }

    console.error("Axios Error:", error);
    return { success: false, message: errorMsg };
  }
}
