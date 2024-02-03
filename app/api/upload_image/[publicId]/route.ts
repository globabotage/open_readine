import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";

interface IParams {
  publicId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    const { publicId } = params;

    const deletetImage = await prisma.uploadedImage.findUnique({
      where: {
        publicId: publicId,
      },
    });

    const betweenId = deletetImage?.betweenId;

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
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
