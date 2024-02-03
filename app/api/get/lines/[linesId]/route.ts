import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
interface IParams {
  linesId?: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  const linesId = params.linesId;

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
    return NextResponse.json(lines);
  } catch (e: any) {
    return NextResponse.json(null);
  }
}
