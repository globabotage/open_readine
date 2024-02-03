import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../getCurrentUser";
import getNonApprovedBetweenIds from "../Admin/getNonApprovedBetweenIds";
import getNonApprovedLinesIds from "../Admin/getNonApprovedLinesIds";
import getRejectedUserIds from "../Admin/getRejectedUserIds";
import { unstable_noStore as noStore } from "next/cache";

export default async function getInitialLinesByBookId(bookId: string) {
  // noStore();
  try {
    const currentUser = await getCurrentUser();

    const lines = await prisma.lines.findMany({
      where: {
        bookId: bookId,
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
    });

    //I can't use orderBy above. Because the type of pageBefore is string.If I use it, I'll get the result {161,162,31,32,...} for exapmple.
    lines.sort((a, b) => Number(a.pageBefore) - Number(b.pageBefore));

    const [rejectedUserIds, nonApprovedLinesIds, nonApprovedBetweensIds] =
      await Promise.all([
        getRejectedUserIds(),
        getNonApprovedLinesIds(),
        getNonApprovedBetweenIds(),
      ]);

    const approvedLines = lines.filter((item) => {
      if (
        currentUser?.id === item.userId ||
        (currentUser?.id !== item.userId &&
          !rejectedUserIds?.includes(item.userId) &&
          !nonApprovedLinesIds?.includes(item.id))
      ) {
        return item;
      }
    });

    const privacyFilteredLines = approvedLines.filter((item) => {
      if (item.isPrivate) {
        if (currentUser?.id === item.userId) {
          return item;
        }
      } else {
        return item;
      }
    });

    const safeLines = privacyFilteredLines.map((item) => ({
      ...item,
      betweens: item.betweens
        .filter((between) => {
          if (
            currentUser?.id === between.userId ||
            (currentUser?.id !== between.userId &&
              !rejectedUserIds?.includes(between.userId) &&
              !nonApprovedBetweensIds?.includes(between.id))
          ) {
            return between;
          }
        })
        .filter((between) => {
          if (between.isPrivate) {
            if (currentUser?.id === between.userId) {
              return between;
            }
          } else {
            return between;
          }
        }),
    }));

    return safeLines[0];
  } catch (error: any) {
    return null;
  }
}
