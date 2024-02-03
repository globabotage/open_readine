import prisma from "@/app/libs/prismadb";
import { unstable_noStore as noStore } from "next/cache";
export default async function getLinesById(linesId: string) {
  // noStore();
  try {
    const lines = await prisma.lines.findUnique({
      where: {
        id: linesId,
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
    return lines;
  } catch (e: any) {
    return null;
  }
}
