import prisma from "@/app/libs/prismadb";
import dayjs from "dayjs";
import getCurrentUser from "./getCurrentUser";
import getRejectedUserIds from "./Admin/getRejectedUserIds";
import getNonApprovedBetweenIds from "./Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "./Admin/getNonApprovedLinesIds";

export default async function getSearchedBetween(query: string) {
  // noStore();
  try {
    const searchConditions = query.split(/[\s　]+/).map((word) => ({
      OR: [
        { lineBefore: { contains: word } },
        { lineAfter: { contains: word } },
        { motivation: { contains: word } },
        { betweens: { some: { content: { contains: word } } } },
      ],
    }));
    const [
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweensIds,
      currentUser,
      lines,
    ] = await Promise.all([
      getRejectedUserIds(),
      getNonApprovedLinesIds(),
      getNonApprovedBetweenIds(),
      getCurrentUser(),
      prisma.lines.findMany({
        where: {
          AND: searchConditions,
        },
        include: {
          book: true,
          user: true,
          betweens: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);
    const rejectedUserIdsSet = new Set(rejectedUserIds);
    const nonApprovedLinesIdsSet = new Set(nonApprovedLinesIds);
    const nonApprovedBetweensIdsSet = new Set(nonApprovedBetweensIds);

    const safeLines = lines.reduce((acc: any, item) => {
      const isApproved =
        currentUser?.id === item.userId ||
        (currentUser?.id !== item.userId &&
          !rejectedUserIdsSet.has(item.userId) &&
          !nonApprovedLinesIdsSet.has(item.id));

      const isPrivacyAllowed =
        !item.isPrivate || (item.isPrivate && currentUser?.id === item.userId);

      if (isApproved && isPrivacyAllowed) {
        const safeBetweens = item.betweens.filter((between) => {
          const isBetweenApproved =
            currentUser?.id === between.userId ||
            (currentUser?.id !== between.userId &&
              !rejectedUserIdsSet.has(between.userId) &&
              !nonApprovedBetweensIdsSet.has(between.id));

          const isBetweenPrivacyAllowed =
            !between.isPrivate ||
            (between.isPrivate && currentUser?.id === between.userId);

          return isBetweenApproved && isBetweenPrivacyAllowed;
        });

        acc.push({ ...item, betweens: safeBetweens });
      }

      return acc;
    }, []);
    return safeLines;
  } catch (error: any) {
    return [];
  }
}
