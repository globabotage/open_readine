import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import getNonApprovedLinesIds from "@/actions/Admin/getNonApprovedLinesIds";
import getNonApprovedBetweenIds from "@/actions/Admin/getNonApprovedBetweenIds";
import getRejectedUserIds from "@/actions/Admin/getRejectedUserIds";
import { NextResponse } from "next/server";

interface IParams {
  query: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  //Don't apply AND search like the serch for books or linesArray here.
  try {
    const { query } = params;
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

    // const approvedLines = uniqueLines.filter((item) => {
    //   if (
    //     currentUser?.id === item.userId ||
    //     (currentUser?.id !== item.userId &&
    //       !rejectedUserIds?.includes(item.userId) &&
    //       !nonApprovedLinesIds?.includes(item.id))
    //   ) {
    //     return item;
    //   }
    // });

    // const privacyFilteredLines = approvedLines.filter((item) => {
    //   if (item.isPrivate) {
    //     if (currentUser?.id === item.userId) {
    //       return item;
    //     }
    //   } else {
    //     return item;
    //   }
    // });

    // const count = privacyFilteredLines.length;

    // const results = privacyFilteredLines.map((item) => ({
    //   ...item,
    //   betweens: item.betweens
    //     .filter((between) => {
    //       if (
    //         currentUser?.id === between.userId ||
    //         (currentUser?.id !== between.userId &&
    //           !rejectedUserIds?.includes(between.userId) &&
    //           !nonApprovedBetweensIds?.includes(between.id))
    //       ) {
    //         return between;
    //       }
    //     })
    //     .filter((between) => {
    //       if (between.isPrivate) {
    //         if (currentUser?.id === between.userId) {
    //           return between;
    //         }
    //       } else {
    //         return between;
    //       }
    //     }),
    // }));

    return NextResponse.json({ results: safeLines, count: safeLines.length });
  } catch (error: any) {
    return NextResponse.json({ results: [], count: 0 });
  }
}
