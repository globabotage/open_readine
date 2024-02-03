import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface Iparams {
  interestId: string;
}

export async function POST(request: Request, { params }: { params: Iparams }) {
  const currentUser = await getCurrentUser();
  const { interestId } = params;

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!interestId || typeof interestId !== "string") {
    throw new Error("Invalid Id");
  }

  let interestIds = currentUser.interestIds || [];

  interestIds.push(interestId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      interestIds: interestIds,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: Iparams }
) {
  const currentUser = await getCurrentUser();
  const { interestId } = params;

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!interestId || typeof interestId !== "string") {
    throw new Error("Invalid Id");
  }

  let interestIds = currentUser.interestIds || [];

  interestIds = interestIds.filter((id) => id !== interestId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      interestIds: interestIds,
    },
  });

  return NextResponse.json(user);
}
