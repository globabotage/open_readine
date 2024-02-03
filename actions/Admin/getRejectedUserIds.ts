import prisma from "@/app/libs/prismadb";

export default async function getRejectedUserIds() {
  try {
    const rejectedUsers = await prisma.rejectedUser.findMany({
      include: {
        user: true,
      },
    });

    const rejectedUserIds = rejectedUsers.map((item) => item.userId) || [];

    return rejectedUserIds;
  } catch (error: any) {
    return [];
  }
}
