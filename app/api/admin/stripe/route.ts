import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { isStripePause } = body;
    const firstAdmin = await prisma.admin.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (firstAdmin) {
      await prisma.admin.update({
        where: {
          id: firstAdmin.id,
        },
        data: {
          isStripePause: isStripePause,
        },
      });
    }

    return new NextResponse("updated", { status: 200 });
  } catch (e: any) {
    return new NextResponse(e, { status: 500 });
  }
}
