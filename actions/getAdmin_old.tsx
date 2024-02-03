import dayjs from "dayjs";
import prisma from "@/app/libs/prismadb";

export default async function getAdmin_old() {
  try {
    // const currentUser = await getCurrentUser();

    // const adminEmail = process.env.ADMIN_EMAIL;

    // if (currentUser?.email !== adminEmail) {
    //   return null;
    // }

    const [rejectedUsers, checkedPosts] = await Promise.all([
      prisma.rejectedUser.findMany({
        include: {
          user: true,
        },
      }),
      prisma.checkedPost.findMany(),
    ]);

    const linesIds = checkedPosts
      .filter((checkedPost) => checkedPost.linesId !== null)
      .map((checkedPost) => checkedPost.linesId);
    const betweenIds = checkedPosts
      .filter((checkedPost) => checkedPost.betweenId !== null)
      .map((checkedPost) => checkedPost.betweenId);

    let unCheckedLines = await prisma.lines.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (linesIds.length > 0) {
      unCheckedLines = await prisma.lines.findMany({
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
      });
    }

    let unCheckedBetween = await prisma.between.findMany({
      include: {
        user: true,
        uploadedImages: true,
        lines: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (betweenIds.length > 0) {
      unCheckedBetween = await prisma.between.findMany({
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
    }

    const nonApprovedPosts = await prisma.checkedPost.findMany({
      where: {
        approved: false,
      },
    });

    const nonApprovedLinesIds = nonApprovedPosts
      .filter((nonApprovedPost) => nonApprovedPost.linesId !== null)
      .map((nonApprovedPost) => nonApprovedPost.linesId);
    const nonApprovedBetweenIds = nonApprovedPosts
      .filter((nonApprovedPost) => nonApprovedPost.betweenId !== null)
      .map((nonApprovedPost) => nonApprovedPost.betweenId);

    let nonApprovedLines = [] as any[];

    if (nonApprovedLinesIds.length > 0) {
      nonApprovedLines = await prisma.lines.findMany({
        where: {
          id: {
            in: nonApprovedLinesIds as string[],
          },
        },
        include: {
          user: true,
        },
        orderBy: {
          updatedAt: "desc", //こちらはupdatedAt & desc
        },
      });
    }

    let nonApprovedBetween = [] as any[];

    if (nonApprovedBetweenIds.length > 0) {
      nonApprovedBetween = await prisma.between.findMany({
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
          updatedAt: "desc", //こちらはupdatedAt & desc
        },
      });
    }

    const rejectedUserIds = rejectedUsers.map((item) => item.userId) || [];

    if (rejectedUserIds.length > 0) {
      unCheckedLines = unCheckedLines.filter(
        (item) => !rejectedUserIds?.includes(item.userId)
      );
      unCheckedBetween = unCheckedBetween.filter(
        (item) => !rejectedUserIds?.includes(item.userId)
      );
      nonApprovedLines = nonApprovedLines.filter(
        (item) => !rejectedUserIds?.includes(item.userId)
      );
      nonApprovedBetween = nonApprovedBetween.filter(
        (item) => !rejectedUserIds?.includes(item.userId)
      );
    }

    const data = {
      unCheckedLines,
      unCheckedBetween,
      nonApprovedLines,
      nonApprovedBetween,
      rejectedUsers,
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweenIds,
    };

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}
