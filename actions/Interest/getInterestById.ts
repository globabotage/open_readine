import prisma from "@/app/libs/prismadb";
import { unstable_noStore as noStore } from "next/cache";

interface Params {
  interestId: string;
}
export default async function getInterestById(params: Params) {
  // noStore();
  try {
    const { interestId } = params;

    const interest = await prisma.interest.findUnique({
      where: {
        id: interestId,
      },
    });

    return interest;
  } catch (error: any) {
    return null;
  }
}
