import dayjs from "dayjs";
import prisma from "@/app/libs/prismadb";
import { Between, Lines } from "@prisma/client";

export default async function getUnCheckedLines() {
  //isFull is only used in the admin page
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

    const linesIds = checkedPosts
      .filter((checkedPost) => checkedPost.linesId !== null)
      .map((checkedPost) => checkedPost.linesId);

    const unCheckedLines = await prisma.lines.findMany({
      where: {
        NOT: {
          id: {
            in: linesIds as string[],
          },
        },
      },
      include: {
        user: true,
        book: true,
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

    return filterRejectedUsers(unCheckedLines.slice(0, 30));
  } catch (error: any) {
    throw new Error(error);
  }
}
