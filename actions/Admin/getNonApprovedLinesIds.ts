import prisma from "@/app/libs/prismadb";

export default async function getNonApprovedLinesIds() {
  try {
    const nonApprovedPosts = await prisma.checkedPost.findMany({
      where: {
        approved: false,
      },
    });

    let nonApprovedLinesIds: string[] = [];

    for (const nonApprovedPost of nonApprovedPosts) {
      if (nonApprovedPost.linesId !== null) {
        nonApprovedLinesIds.push(nonApprovedPost.linesId);
      }
    }

    return nonApprovedLinesIds;
  } catch (error: any) {
    return [];
  }
}
