import prisma from "@/app/libs/prismadb";

export default async function getInterests() {
  try {
    const interests = await prisma.interest.findMany();

    return interests;
  } catch (error: any) {
    return [];
  }
}
