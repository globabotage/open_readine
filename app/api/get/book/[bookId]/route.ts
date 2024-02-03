import prisma from "@/app/libs/prismadb";
import getNonApprovedBetweenIds from "@/actions/Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "@/actions/Admin/getNonApprovedLinesIds";
import getRejectedUserIds from "@/actions/Admin/getRejectedUserIds";
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

interface IParams {
  bookId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const { bookId } = params;

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

    return NextResponse.json(safeBook);
  } catch (error: any) {
    return NextResponse.json(null);
  }
}
