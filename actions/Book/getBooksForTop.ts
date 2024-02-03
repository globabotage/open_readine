import prisma from "@/app/libs/prismadb";
import getRejectedUserIds from "../Admin/getRejectedUserIds";
import getNonApprovedLinesIds from "../Admin/getNonApprovedLinesIds";
import getNonApprovedBetweenIds from "../Admin/getNonApprovedBetweenIds";
import { unstable_noStore as noStore } from "next/cache";
export default async function getBooksForTop() {
  // noStore();
  try {
    const [rejectedUserIds, nonApprovedLinesIds, nonApprovedBetweenIds, books] =
      await Promise.all([
        getRejectedUserIds(),
        getNonApprovedLinesIds(),
        getNonApprovedBetweenIds(),
        prisma.book.findMany({
          where: {
            OR: [{ lines: { some: { isPrivate: false } } }],
          },
          include: {
            lines: {
              include: {
                betweens: true,
              },
            },
          },
        }),
      ]);

    const safeBooks = books
      .sort(() => Math.random() - 0.5) //ランダムに並び替え
      .slice(0, 7) //10件に絞る
      .map((item) => ({
        ...item,
        lines: item.lines.filter((line) => {
          if (
            !rejectedUserIds?.includes(line.userId) &&
            !nonApprovedLinesIds?.includes(line.id)
          ) {
            return {
              ...line,
              betweens: line.betweens.filter((between) => {
                if (
                  !rejectedUserIds?.includes(between.userId) &&
                  !nonApprovedBetweenIds?.includes(between.id)
                ) {
                  return between;
                }
              }),
            };
          }
        }),
      }));

    return safeBooks;
  } catch (error: any) {
    return [];
  }
}
