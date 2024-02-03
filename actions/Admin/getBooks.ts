import prisma from "@/app/libs/prismadb";

export default async function getBooks() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return books || null;
  } catch (e: any) {
    return null;
  }
}
