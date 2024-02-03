import getCurrentUser from "../getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getPaymentRequests() {
  // noStore();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }
    const paymentRequests = await prisma.thanksRequest.findMany({
      where: {
        AND: [
          { opponentUserId: currentUser.id },
          { deletedAt: null },
          { completedAt: null },
        ],
      },
      include: {
        user: true,
        opponentUser: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return paymentRequests;
  } catch (error: any) {
    return [];
  }
}
