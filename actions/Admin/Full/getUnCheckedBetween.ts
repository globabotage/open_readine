import dayjs from "dayjs";
import prisma from "@/app/libs/prismadb";
import { Between, Lines } from "@prisma/client";

export default async function getUnCheckedBetween() {
  try {
    const [rejectedUsers, checkedPosts] = await Promise.all([
      prisma.rejectedUser.findMany({
        include: {
          user: true,
        },
      }),

      prisma.checkedPost.findMany(),
    ]);

    const rejectedUserIds = rejectedUsers.map((item) => item.userId) || [];

    const betweenIds = checkedPosts
      .filter((checkedPost) => checkedPost.betweenId !== null)
      .map((checkedPost) => checkedPost.betweenId);

    const unCheckedBetween = await prisma.between.findMany({
      where: {
        NOT: {
          id: {
            in: betweenIds as string[],
          },
        },
      },
      include: {
        user: true,
        uploadedImages: true,
        lines: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const filterRejectedUsers = (data: (Lines | Between)[]) => {
      if (rejectedUserIds.length > 0) {
        return data.filter((item) => !rejectedUserIds.includes(item.userId));
      }
      return data;
    };

    return filterRejectedUsers(unCheckedBetween.slice(0, 30));
  } catch (error: any) {
    throw new Error(error);
  }
}
