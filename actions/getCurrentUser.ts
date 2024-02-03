import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
import { unstable_noStore as noStore } from "next/cache";

export default async function getCurrentUser() {
  // noStore();
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
}
