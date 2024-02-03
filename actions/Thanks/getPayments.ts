import getCurrentUser from "../getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getPayments() {
  // noStore();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }
    const payments = await prisma.thanks.findMany({
      where: {
        opponentUserId: currentUser.id,
      },
      include: {
        user: true,
        opponentUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return payments;
  } catch (error: any) {
    return [];
  }
}
