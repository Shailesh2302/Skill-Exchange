import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Required since user will always have an ID when authenticated
      isVerified: boolean; // Required since this determines access
      isAcceptingMessages: boolean; // Required for your app logic
      username: string; // Required since users must have usernames
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Required
    isVerified: boolean; // Required 
    isAcceptingMessages: boolean; // Required
    username: string; // Required
    email: string; // Add email since it's part of your auth flow
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Required
    isVerified: boolean; // Required
    isAcceptingMessages: boolean; // Required
    username: string; // Required
    email?: string; // Optional since it might not always be needed in JWT
  }
}