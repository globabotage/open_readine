import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../getCurrentUser";
import getRejectedUserIds from "../Admin/getRejectedUserIds";
import getNonApprovedLinesIds from "../Admin/getNonApprovedLinesIds";
import getNonApprovedBetweenIds from "../Admin/getNonApprovedBetweenIds";
import { unstable_noStore as noStore } from "next/cache";
interface Params {
  userId?: string;
}
export default async function getBooksByUserId(params: Params) {
  // noStore();
  try {
    const { userId } = params;

    const [
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweenIds,
      currentUser,
      baseBooks,
    ] = await Promise.all([
      getRejectedUserIds(),
      getNonApprovedLinesIds(),
      getNonApprovedBetweenIds(),
      getCurrentUser(),
      prisma.book.findMany({
        where: {
          OR: [
            { lines: { some: { userId: userId } } },
            {
              lines: {
                some: {
                  betweens: {
                    some: { userId: userId },
                  },
                },
              },
            },
          ],
        },
        include: {
          lines: {
            include: { betweens: true },
          },
        },
        orderBy: { titleAlphabet: "asc" },
      }),
    ]);

    let books = baseBooks;

    if (!currentUser || currentUser?.id !== userId) {
      books = books.filter((item) => {
        if (
          item.lines.some(
            (line) => line.userId === userId && line.isPrivate === false
          )
        ) {
          return item;
        } else {
          if (
            item.lines.some((line) =>
              line.betweens.some(
                (b) => b.userId === userId && b.isPrivate === false
              )
            )
          ) {
            return item;
          }
        }
      });
    }
    const rejectedUserIdsSet = new Set(rejectedUserIds);
    const nonApprovedLinesIdsSet = new Set(nonApprovedLinesIds);
    const nonApprovedBetweenIdsSet = new Set(nonApprovedBetweenIds);

    const safeBooks = books.map((item) => ({
      ...item,
      lines: item.lines.filter((line) => {
        if (
          !rejectedUserIdsSet?.has(line.userId) &&
          !nonApprovedLinesIdsSet?.has(line.id)
        ) {
          return {
            ...line,
            betweens: line.betweens.filter((between) => {
              if (
                !rejectedUserIdsSet?.has(between.userId) &&
                !nonApprovedBetweenIdsSet?.has(between.id)
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
    throw new Error(error);
  }
}
