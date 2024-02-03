import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../getCurrentUser";
import { unstable_noStore as noStore } from "next/cache";
import getNonApprovedBetweenIds from "../Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "../Admin/getNonApprovedLinesIds";
import getRejectedUserIds from "../Admin/getRejectedUserIds";
export default async function getBooksByBookmark() {
  // noStore();
  try {
    const currentUser = await getCurrentUser();

    const [
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweenIds,
      baseBooks,
    ] = await Promise.all([
      getRejectedUserIds(),
      getNonApprovedLinesIds(),
      getNonApprovedBetweenIds(),

      prisma.book.findMany({
        where: {
          id: {
            in: currentUser?.bookmarkBookIds || [],
          },
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
