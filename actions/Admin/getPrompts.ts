import prisma from "@/app/libs/prismadb";

export default async function getPrompots() {
  try {
    const prompts = await prisma.prompts.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return prompts || null;
  } catch (e: any) {
    return null;
  }
}
