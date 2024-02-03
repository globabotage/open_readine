import prisma from "@/app/libs/prismadb";
import { unstable_noStore as noStore } from "next/cache";
export default async function getInterestsByLinesId(linesId: string) {
  // noStore();
  try {
    const lines = await prisma.lines.findUnique({
      where: {
        id: linesId,
      },
    });
    const interests = await prisma.interest.findMany({
      where: {
        id: {
          in: lines?.interestIds || [],
        },
      },
    });

    return interests;
  } catch (error: any) {
    return null;
  }
}
