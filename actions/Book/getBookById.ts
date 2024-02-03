import prisma from "@/app/libs/prismadb";
import { unstable_noStore as noStore } from "next/cache";
import getNonApprovedBetweenIds from "../Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "../Admin/getNonApprovedLinesIds";
import getRejectedUserIds from "../Admin/getRejectedUserIds";
import getCurrentUser from "../getCurrentUser";

export default async function getBookById(bookId: string) {
  // noStore();
  try {
    const [
      rejectedUserIds,
      nonApprovedLinesIds,
      nonApprovedBetweenIds,
      currentUser,
      book,
    ] = await Promise.all([
      getRejectedUserIds(),
      getNonApprovedLinesIds(),
      getNonApprovedBetweenIds(),
      getCurrentUser(),
      prisma.book.findUnique({
        where: {
          id: bookId,
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

    const rejectedUserIdsSet = new Set(rejectedUserIds);
    const nonApprovedLinesIdsSet = new Set(nonApprovedLinesIds);
    const nonApprovedBetweenIdsSet = new Set(nonApprovedBetweenIds);

    const safeBook = {
      ...book,
      lines: book?.lines.filter((line) => {
        const isLinePrivate = line.isPrivate;
        const isCurrentUserLineOwner = currentUser?.id === line.userId;
        const isLineRejected = rejectedUserIdsSet.has(line.userId);
        const isLineNonApproved = nonApprovedLinesIdsSet.has(line.id);

        if ((isLinePrivate && isCurrentUserLineOwner) || !isLinePrivate) {
          if (!isLineRejected && !isLineNonApproved) {
            line.betweens = line.betweens.filter((between) => {
              const isBetweenRejected = rejectedUserIdsSet.has(between.userId);
              const isBetweenNonApproved = nonApprovedBetweenIdsSet.has(
                between.id
              );

              return !isBetweenRejected && !isBetweenNonApproved;
            });

            return true;
          }
        }

        return false;
      }),
    };

    return safeBook;
  } catch (error: any) {
    return null;
  }
}
