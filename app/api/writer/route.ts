import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }
  const body = await request.json();
  const { name, detail } = body;

  const updatedUser = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      name: name,
      detail: detail,
    },
  });

  return NextResponse.json(updatedUser);
}
