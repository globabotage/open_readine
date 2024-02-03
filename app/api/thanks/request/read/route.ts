import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  thanksId: string;
}

export async function POST(request: Request) {
  const body = await request.json();

  const currentUser = await getCurrentUser();

  let condition;
  let updateData;

  if (body.userType === "receiver") {
    condition = {
      AND: [{ userId: currentUser?.id }, { isUserRead: false }],
    };
    updateData = {
      isUserRead: true,
    };
  }
  if (body.userType === "sender") {
    condition = {
      AND: [{ opponentUserId: currentUser?.id }, { isOpponentRead: false }],
    };
    updateData = {
      isOpponentRead: true,
    };
  }
  const thanksRequest = await prisma.thanksRequest.updateMany({
    where: condition,
    data: {
      ...updateData,
    },
  });

  return NextResponse.json(thanksRequest);
}
