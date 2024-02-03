import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import getCurrentUser from "@/actions/getCurrentUser";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
interface IParams {
  betweenId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const body = await request.json();
  const { betweenId } = params;
  const currentUser = await getCurrentUser();

  const { between, isPrivate, imageUrls } = body;
  const newBetween = await prisma.between.update({
    where: {
      id: betweenId,
    },
    data: {
      content: between ? between : null,
      isPrivate: isPrivate,
    },
  });

  if (imageUrls) {
    for (const imageUrl of imageUrls) {
      await prisma.uploadedImage.update({
        where: {
          id: imageUrl.id,
        },
        data: {
          betweenId: newBetween.id,
        },
      });
    }

    const deleteImages = await prisma.uploadedImage.findMany({
      where: {
        userId: currentUser?.id,
        OR: [
          { betweenId: null },
          {
            AND: [
              { betweenId: newBetween.id },
              {
                NOT: {
                  publicId: { in: imageUrls.map((item: any) => item.publicId) },
                },
              },
            ],
          },
        ],
      },
    });

    if (deleteImages.length > 0) {
      for (const deleteImage of deleteImages) {
        await prisma.uploadedImage.delete({
          where: {
            id: deleteImage.id,
          },
        });

        await cloudinary.uploader.destroy(deleteImage.publicId);
      }
    }
  }

  return NextResponse.json(newBetween);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const { betweenId } = params;

  const deleteImages = await prisma.uploadedImage.findMany({
    where: {
      betweenId: betweenId,
    },
  });

  for (const deleteImage of deleteImages) {
    await cloudinary.uploader.destroy(deleteImage.publicId);
  }

  await prisma.uploadedImage.deleteMany({
    where: {
      betweenId: betweenId,
    },
  });

  await prisma.between.delete({
    where: {
      id: betweenId,
    },
  });

  return NextResponse.json({ message: "success" });
}
