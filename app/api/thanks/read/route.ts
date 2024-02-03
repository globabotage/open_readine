import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  thanksId: string;
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  const thanks = await prisma.thanks.updateMany({
    where: {
      AND: [{ userId: currentUser?.id }, { isRead: false }],
    },
    data: {
      isRead: true,
    },
  });

  return NextResponse.json("read");
}
