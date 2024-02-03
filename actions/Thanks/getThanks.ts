import getCurrentUser from "../getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getThanks() {
  // noStore();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }
    const thanks = await prisma.thanks.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        user: true,
        opponentUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return thanks;
  } catch (error: any) {
    return [];
  }
}
