import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  token: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const token = params.token;

    const existingToken = await prisma.user.findMany({
      where: {
        rememberToken: token,
      },
    });

    const user = existingToken[0];

    if (!user) {
      return new NextResponse("expired");
    }

    const now = new Date();
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: now,
        rememberToken: null,
        rememberTokenExpiry: null,
      },
    });

    return new NextResponse("Regislation Complete", { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
