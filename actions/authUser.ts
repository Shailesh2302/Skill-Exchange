import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth";

export async function authUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  return true;
}
