import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface Iparams {
  linesId: string;
}

export async function POST(request: Request, { params }: { params: Iparams }) {
  const currentUser = await getCurrentUser();
  const { linesId } = params;

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!linesId || typeof linesId !== "string") {
    throw new Error("Invalid Id");
  }

  let linesIds = currentUser.bookmarkLinesIds || [];

  linesIds.push(linesId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      bookmarkLinesIds: linesIds,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: Iparams }
) {
  const currentUser = await getCurrentUser();
  const { linesId } = params;

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!linesId || typeof linesId !== "string") {
    throw new Error("Invalid Id");
  }

  let linesIds = currentUser.bookmarkLinesIds || [];

  linesIds = linesIds.filter((id) => id !== linesId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      bookmarkLinesIds: linesIds,
    },
  });

  return NextResponse.json(user);
}
