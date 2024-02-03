import prisma from "@/app/libs/prismadb";
import getRejectedUserIds from "../Admin/getRejectedUserIds";
import getNonApprovedLinesIds from "../Admin/getNonApprovedLinesIds";
import { unstable_noStore as noStore } from "next/cache";
export default async function getLinesForTop() {
  try {
    const [rejectedUserIds, nonApprovedLinesIds] = await Promise.all([
      getRejectedUserIds(),
      getNonApprovedLinesIds(),
    ]);

    const lines = await prisma.lines.findMany({
      where: {
        isPrivate: false,
        OR: [
          {
            userId: {
              notIn: rejectedUserIds || [],
            },
          },
          {
            id: {
              notIn: nonApprovedLinesIds,
            },
          },
        ],
      },
      include: {
        book: true,
        user: true,
      },
    });

    const results = lines
      .sort(() => Math.random() - 0.5) //ランダムに並び替え
      .slice(0, 7); //10件に絞る

    return results;
  } catch (error: any) {
    return [];
  }
}
