import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { unstable_noStore as noStore } from "next/cache";
import getNonApprovedBetweenIds from "./Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "./Admin/getNonApprovedLinesIds";
import getRejectedUserIds from "./Admin/getRejectedUserIds";

export default async function getSearchedInterest(query: string) {
  // noStore();
  try {
    const currentUser = await getCurrentUser();

    const [
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweensIds,
      interest,
    ] = await Promise.all([
      getRejectedUserIds(),
      getNonApprovedLinesIds(),
      getNonApprovedBetweenIds(),
      prisma.interest.findMany({
        where: {
          name: {
            contains: query,
          },
        },
      }),
    ]);

    let lines = [];
    for (const i of interest) {
      const line = await prisma.lines.findMany({
        where: {
          interestIds: {
            has: i.id,
          },
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
      });
      lines.push(...line);
    }

    //lines配列から重複した'id'の要素を削除
    let uniqueLines = lines.filter(
      (line, index, self) => index === self.findIndex((l) => l.id === line.id)
    );
    //↑解説：https://chat.openai.com/share/df0ef538-a2bf-4f22-9fb1-5c3bbeab2728
    uniqueLines.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const rejectedUserIdsSet = new Set(rejectedUserIds);
    const nonApprovedLinesIdsSet = new Set(nonApprovedLinesIds);
    const nonApprovedBetweensIdsSet = new Set(nonApprovedBetweensIds);

    const safeLines = uniqueLines.reduce((acc: any, item) => {
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
