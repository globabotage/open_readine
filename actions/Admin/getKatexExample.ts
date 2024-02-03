import prisma from "@/app/libs/prismadb";

export default async function getKatexExample() {
  try {
    const admin = await prisma.admin.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    const katexExample = admin?.katexExample || null;

    return katexExample;
  } catch (e: any) {
    return null;
  }
}
