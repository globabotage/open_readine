import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../getCurrentUser";
export default async function getThanksRequests() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }
    const thanksRequests = await prisma.thanksRequest.findMany({
      where: {
        AND: [
          { userId: currentUser.id },
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

    return thanksRequests;
  } catch (e: any) {
    return [];
  }
}
