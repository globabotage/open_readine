import dayjs from "dayjs";
import prisma from "@/app/libs/prismadb";
import { Between, Lines } from "@prisma/client";

export default async function getAdmin(isFull?: boolean) {
  //isFull is only used in the admin page
  try {
    const [rejectedUsers, nonApprovedPosts, checkedPosts] = await Promise.all([
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
      prisma.checkedPost.findMany(),
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

    // const nonApprovedLinesIds = nonApprovedPosts
    //   .filter((nonApprovedPost) => nonApprovedPost.linesId !== null)
    //   .map((nonApprovedPost) => nonApprovedPost.linesId);
    // const nonApprovedBetweenIds = nonApprovedPosts
    //   .filter((nonApprovedPost) => nonApprovedPost.betweenId !== null)
    //   .map((nonApprovedPost) => nonApprovedPost.betweenId);

    const rejectedUserIds = rejectedUsers.map((item) => item.userId) || [];

    if (!isFull) {
      return {
        rejectedUserIds,
        nonApprovedLinesIds,
        nonApprovedBetweenIds,
      };
    }

    //The following data are only used in the admin page

    const linesIds = checkedPosts
      .filter((checkedPost) => checkedPost.linesId !== null)
      .map((checkedPost) => checkedPost.linesId);
    const betweenIds = checkedPosts
      .filter((checkedPost) => checkedPost.betweenId !== null)
      .map((checkedPost) => checkedPost.betweenId);

    const [
      unCheckedLines,
      unCheckedBetween,
      nonApprovedLines,
      nonApprovedBetween,
    ] = await Promise.all([
      prisma.lines.findMany({
        where: {
          NOT: {
            id: {
              in: linesIds as string[],
            },
          },
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.between.findMany({
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
      }),
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

    // const formatData = (
    //   data: (Lines | Between)[]
    // ): (Lines | Between)[] => {
    //   return data.map((item) => ({
    //     ...item,
    //     createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
    //     updatedAt: dayjs(item.updatedAt).format("YYYY-MM-DD"),
    //   }));
    // };

    const filterRejectedUsers = (data: (Lines | Between)[]) => {
      if (rejectedUserIds.length > 0) {
        return data.filter((item) => !rejectedUserIds.includes(item.userId));
      }
      return data;
    };

    return {
      unCheckedLines: filterRejectedUsers(unCheckedLines.slice(0, 10)),
      unCheckedBetween: filterRejectedUsers(unCheckedBetween.slice(0, 10)),
      nonApprovedLines: filterRejectedUsers(nonApprovedLines),
      nonApprovedBetween: filterRejectedUsers(nonApprovedBetween),
      rejectedUsers,
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweenIds,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
