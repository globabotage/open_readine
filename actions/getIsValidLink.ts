import prisma from "@/app/libs/prismadb";
import { unstable_noStore as noStore } from "next/cache";

export default async function getIsValidLink(query: string) {
  try {
    const expiry = await prisma.user.findMany({
      where: {
        rememberToken: query,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let isExpired = false;

    if (!expiry) {
      isExpired = true;
    }
    if (expiry) {
      const expiryUser = expiry[0];
      isExpired = new Date(expiryUser.rememberTokenExpiry as Date) > new Date();
    }

    return isExpired;
  } catch (error: any) {
    throw new Error(error);
  }
}
