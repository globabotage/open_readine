import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../getCurrentUser";
import getNonApprovedBetweenIds from "../Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "../Admin/getNonApprovedLinesIds";
import getRejectedUserIds from "../Admin/getRejectedUserIds";
import { unstable_noStore as noStore } from "next/cache";
export default async function getInitialLinesByMyInterests() {
  // noStore();
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }
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
          interestIds: {
            hasSome: currentUser.interestIds || [],
          },
        },
        include: {
          book: true,
          user: true,
          betweens: {
            include: {
              user: true,
              uploadedImages: true,
              lines: true,
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

    return safeLines[0];
  } catch (error: any) {
    return null;
  }
}
