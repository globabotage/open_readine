import prisma from "@/app/libs/prismadb";

export default async function getNonApprovedBetweenIds() {
  try {
    const nonApprovedPosts = await prisma.checkedPost.findMany({
      where: {
        approved: false,
      },
    });

    let nonApprovedBetweenIds: string[] = [];

    for (const nonApprovedPost of nonApprovedPosts) {
      if (nonApprovedPost.betweenId !== null) {
        nonApprovedBetweenIds.push(nonApprovedPost.betweenId);
      }
    }

    return nonApprovedBetweenIds;
  } catch (error: any) {
    return [];
  }
}
