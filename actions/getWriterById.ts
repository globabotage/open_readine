import prisma from "@/app/libs/prismadb";
import { unstable_noStore as noStore } from "next/cache";
interface Params {
  userId: string;
}
export default async function getWriterById(params: Params) {
  // noStore();
  try {
    const { userId } = params;
    const writer = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        lines: true,
        between: true,
      },
    });

    return writer;
  } catch (error: any) {
    return null;
  }
}
