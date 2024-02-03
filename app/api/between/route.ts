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

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { linesId, isPrivate, imageUrls } = body;

    const Between = body.between;

    if (!Between && !imageUrls) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newBetween = await prisma.between.create({
      data: {
        userId: currentUser.id,
        linesId: linesId,
        content: Between,
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
                    publicId: {
                      in: imageUrls.map((item: any) => item.publicId),
                    },
                  },
                },
              ],
            },
          ],
        },
      });

      if (deleteImages.length > 0) {
        // Delete images from the database in one operation
        await prisma.uploadedImage.deleteMany({
          where: {
            id: {
              in: deleteImages.map((image) => image.id),
            },
          },
        });

        // Delete images from Cloudinary in parallel
        await Promise.all(
          deleteImages.map((image) =>
            cloudinary.uploader.destroy(image.publicId)
          )
        );
      }
    }

    return NextResponse.json(newBetween);
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse(error, { status: 500 });
  }
}
