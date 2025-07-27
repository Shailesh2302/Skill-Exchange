"use server";

import prisma from "@/db/prisma";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { signUpSchema } from "@/schemas/signUpSchema";
import bcrypt from "bcryptjs";
// import { randomUUID } from "crypto";

export default async function signupAction(
  prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = signUpSchema.safeParse(formData)

  if (!result?.success) {
    return 
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    return { success: false, error: "Username already taken." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    if (!existingUser.isVerified) {
      return { success: false, error: "User with this email already exists." };
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const code = String(Math.floor(100000 + Math.random() * 900000));
      const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          email,
          username,
          password: hashedPassword,
          verifyCode: code,
          verifyCodeExpiry,
          isVerified: false,
          isAcceptingMessages: true,
        },
      });

      const emailResponse = await sendVerificationEmail(email, username, code);
    if (!emailResponse.success) {
       throw new Error(emailResponse.message)
    }

      return {
      success: true,
      error: null,
      message: "User registered successfully. Please verify your account.",
      username,
    };
    }
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        verifyCode: code,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessages: true,
      },
    });

    const emailResponse = await sendVerificationEmail(email, username, code);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return {
      success: true,
      error: null,
      message: "User registered successfully. Please verify your account.",
      username,
    };
  }
}
