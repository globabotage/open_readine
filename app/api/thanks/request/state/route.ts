import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const body = await request.json();

  const currentUser = await getCurrentUser();

  const sendRequest = await prisma.thanksRequest.findFirst({
    where: {
      AND: [{ userId: body.userId }, { opponentUserId: currentUser?.id }],
    },
  });

  return NextResponse.json(sendRequest);
}
