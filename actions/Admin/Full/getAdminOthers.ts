import dayjs from "dayjs";
import prisma from "@/app/libs/prismadb";
import { Between, Lines } from "@prisma/client";

export default async function getAdminOthers() {
  //isFull is only used in the admin page
  try {
    const [rejectedUsers, nonApprovedPosts] = await Promise.all([
      prisma.rejectedUser.findMany({
        include: {
          user: true,
        },
      }),

      prisma.checkedPost.findMany({
        where: {
          approved: false,
        },
      }),
    ]);

    let nonApprovedLinesIds: string[] = [];
    let nonApprovedBetweenIds: string[] = [];

    for (const nonApprovedPost of nonApprovedPosts) {
      if (nonApprovedPost.linesId !== null) {
        nonApprovedLinesIds.push(nonApprovedPost.linesId);
      }
      if (nonApprovedPost.betweenId !== null) {
        nonApprovedBetweenIds.push(nonApprovedPost.betweenId);
      }
    }

    const rejectedUserIds = rejectedUsers.map((item) => item.userId) || [];

    const [nonApprovedLines, nonApprovedBetween] = await Promise.all([
      prisma.lines.findMany({
        where: {
          id: {
            in: nonApprovedLinesIds as string[],
          },
        },
        include: {
          user: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.between.findMany({
        where: {
          id: {
            in: nonApprovedBetweenIds as string[],
          },
        },
        include: {
          user: true,
          lines: true,
          uploadedImages: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    const filterRejectedUsers = (data: (Lines | Between)[]) => {
      if (rejectedUserIds.length > 0) {
        return data.filter((item) => !rejectedUserIds.includes(item.userId));
      }
      return data;
    };

    return {
      nonApprovedLines: filterRejectedUsers(nonApprovedLines),
      nonApprovedBetween: filterRejectedUsers(nonApprovedBetween),
      rejectedUsers,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
