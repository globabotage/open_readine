import prisma from "@/app/libs/prismadb";
import { unstable_noStore as noStore } from "next/cache";
import getNonApprovedBetweenIds from "./Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "./Admin/getNonApprovedLinesIds";
import getRejectedUserIds from "./Admin/getRejectedUserIds";
import getCurrentUser from "./getCurrentUser";
import { SafeBook } from "@/types";
export default async function getSearchedBooks(
  query: string
): Promise<SafeBook[]> {
  // noStore();
  try {
    const searchConditions = query.split(/[\s　]+/).map((word) => ({
      OR: [
        { title: { contains: word } },
        { titleAlphabet: { contains: word } },
        { author: { contains: word } },
        { publisher: { contains: word } },
        { isbn: { contains: word } },
      ],
    }));

    const [
      currentUser,
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweenIds,
      baseBooks,
    ] = await Promise.all([
      getCurrentUser(),
      getRejectedUserIds(),
      getNonApprovedLinesIds(),
      getNonApprovedBetweenIds(),
      prisma.book.findMany({
        where: {
          AND: searchConditions,
          //If the value of query can be divided by space, it is searched by each word.
        },
        include: {
          lines: {
            include: {
              betweens: true,
            },
          },
        },
        orderBy: {
          titleAlphabet: "asc",
        },
      }),
    ]);

    let books = baseBooks;

    books = books.filter((item) => {
      if (
        item.lines.some(
          (line) =>
            line.isPrivate === false ||
            (line.isPrivate === true && line.userId === currentUser?.id)
        )
      ) {
        return item;
      }
    });

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
    return [];
  }
}
