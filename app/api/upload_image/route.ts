import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { url, public_id, betweenId } = body;

    if (!currentUser) {
      return NextResponse.error();
    }

    if (!url) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const newUploadedImage = await prisma.uploadedImage.create({
      data: {
        url: url,
        publicId: public_id,
        betweenId: null,
        userId: currentUser?.id,
      },
    });

    const uploadedImages = await prisma.uploadedImage.findMany({
      where: {
        AND: [
          { userId: currentUser?.id },
          {
            OR: [{ betweenId: null }, { betweenId: betweenId }],
          },
        ],
      },
    });
    return NextResponse.json(uploadedImages);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
