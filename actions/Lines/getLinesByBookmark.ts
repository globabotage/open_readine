import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../getCurrentUser";
import { unstable_noStore as noStore } from "next/cache";
import getNonApprovedBetweenIds from "../Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "../Admin/getNonApprovedLinesIds";
import getRejectedUserIds from "../Admin/getRejectedUserIds";

export default async function getLinesByBookmark() {
  // noStore();
  try {
    const currentUser = await getCurrentUser();
    const [
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweensIds,
      lines,
    ] = await Promise.all([
      getRejectedUserIds(),
      getNonApprovedLinesIds(),
      getNonApprovedBetweenIds(),
      prisma.lines.findMany({
        //interestIds プロパティが、currentUser の interestIds 配列のいずれかの要素を含む行を取得
        where: {
          id: {
            in: currentUser?.bookmarkLinesIds || [],
          },
        },
        include: {
          book: true,
          user: true,
          betweens: {
            include: {
              user: true,
              uploadedImages: true,
            },
          },
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
