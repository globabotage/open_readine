import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface Iparams {
  bookId: string;
}
export async function POST(request: Request, { params }: { params: Iparams }) {
  const currentUser = await getCurrentUser();
  const { bookId } = params;

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!bookId || typeof bookId !== "string") {
    throw new Error("Invalid Id");
  }

  let bookIds = currentUser.bookmarkBookIds || [];

  bookIds.push(bookId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      bookmarkBookIds: bookIds,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: Iparams }
) {
  const currentUser = await getCurrentUser();
  const { bookId } = params;

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!bookId || typeof bookId !== "string") {
    throw new Error("Invalid Id");
  }

  let bookIds = currentUser.bookmarkBookIds || [];

  bookIds = bookIds.filter((id) => id !== bookId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      bookmarkBookIds: bookIds,
    },
  });

  return NextResponse.json(user);
}
