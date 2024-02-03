import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  linesId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const body = await request.json();
  const { linesId } = params;

  const Interests = body.interests;
  //prismaのmodel名との重複を避けるためCammelCaseに変更

  for (const interest of Interests) {
    const existingInterest = await prisma.interest.findUnique({
      where: {
        name: interest,
      },
    });

    if (!existingInterest) {
      await prisma.interest.create({
        data: {
          name: interest,
        },
      });
    }
  }

  const interests = await prisma.interest.findMany({
    where: {
      name: {
        in: Interests,
      },
    },
  });

  const interestIds = interests.map((interest) => interest.id);

  const lines = await prisma.lines.update({
    where: {
      id: linesId,
    },
    data: {
      pageBefore: body.pageBefore,
      pageAfter: body.pageAfter,
      lineBefore: body.lineBefore,
      lineAfter: body.lineAfter,
      motivation: body.motivation,
      isPrivate: body.isPrivate,
      interestIds: {
        set: interestIds,
      },
    },
  });

  return NextResponse.json(lines);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const { linesId } = params;

  const lines = await prisma.lines.delete({
    where: {
      id: linesId,
    },
  });

  return NextResponse.json(lines);
}
