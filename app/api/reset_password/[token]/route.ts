import prisma from "@/app/libs/prismadb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface IParams {
  token: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const token = params.token;
    const body = await request.json();
    const { password } = body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingToken = await prisma.user.findMany({
      where: {
        rememberToken: token,
      },
    });

    const user = existingToken[0];

    if (!user) {
      return new NextResponse("expired");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword,
        rememberToken: null,
        rememberTokenExpiry: null,
      },
    });

    return new NextResponse("Password reset", { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
