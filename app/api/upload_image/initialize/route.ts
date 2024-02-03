import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    const deleteImages = await prisma.uploadedImage.deleteMany({
      where: {
        AND: [{ userId: currentUser?.id }, { betweenId: null }],
      },
    });
    return NextResponse.json(deleteImages);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
