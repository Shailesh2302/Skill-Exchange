// import { hash } from "bcryptjs";
// import prisma from "@/db/prisma";
// import { NextRequest, NextResponse } from "next/server";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(request: NextRequest) {
//   try {
//     const {
//       username,
//       email,
//       password,
//     }: { username: string; email: string; password: string } =
//       await request.json();

//     const existingUserWithUsername = await prisma.user.findFirst({
//       where: {
//         username,
//         isVerified: true,
//       },
//     });

//     if (existingUserWithUsername) {
//       return NextResponse.json(
//         { success: false, message: "Username is already taken." },
//         { status: 400 }
//       );
//     }

//     const existingUserWithEmail = await prisma.user.findUnique({
//       where: { email },
//     });
//     const hashedPassword = await hash(password, 10);
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//     if (existingUserWithEmail) {
//       if (existingUserWithEmail.isVerified) {
//         return NextResponse.json(
//           { success: false, message: "User already exists with this email." },
//           { status: 400 }
//         );
//       } else {
//         await prisma.user.update({
//           where: {
//             email,
//           },
//           data: {
//             username,
//             password: hashedPassword,
//             email,
//             verifyCode,
//             isVerified: false,
//             isAcceptingMessages: true,
//             verifyCodeExpiry: new Date(Date.now() + 60 * 60 * 1000),
//           },
//         });
//       }
//     } else {
//       await prisma.user.create({
//         data: {
//           username,
//           password: hashedPassword,
//           email,
//           verifyCode,
//           isVerified: false,
//           isAcceptingMessages: true,
//           verifyCodeExpiry: new Date(Date.now() + 60 * 60 * 1000),
//         },
//       });
//     }

//     const emailResponse = await sendVerificationEmail(
//       email,
//       username,
//       verifyCode
//     );
//     if (!emailResponse.success) {
//       return NextResponse.json(
//         { success: false, message: emailResponse.message },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "Signup successful. Please check your email to verify your account.",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server error during signup." },
//       { status: 500 }
//     );
//   }
// }
