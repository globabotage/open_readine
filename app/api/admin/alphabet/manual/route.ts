import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { book } = body;

    await prisma.book.update({
      where: {
        id: book.id,
      },
      data: {
        titleAlphabet: book.titleAlphabet,
      },
    });

    return new NextResponse("updated", { status: 200 });
  } catch (e: any) {
    return new NextResponse(e, { status: 500 });
  }
}
