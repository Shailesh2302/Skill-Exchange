"use server";

import axios from "axios";

export default async function verifyAction(_: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const code = formData.get("code") as string;

  if (!username || !code) {
    return { success: false, message: "Username and Code are required" };
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/verify/${encodeURIComponent(username)}/check`,
      { code }, // Pass code in body
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data; // { success: boolean, message: string }
  } catch (error: any) {
    console.error("Axios Error:", error?.response?.data || error.message);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    return { success: false, message: errorMsg };
  }
}
