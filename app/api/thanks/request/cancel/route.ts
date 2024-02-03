import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.thanksRequest.update({
    where: {
      id: body.thanksRequestId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return NextResponse.json({ message: "Request is canceled" });
}
