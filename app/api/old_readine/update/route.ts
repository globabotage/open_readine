import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { linesArray, betweenArray } = body;

  //replace userId in lines correctly
  // try {
  //   let userArray = [];

  //   for (const lines of linesArray) {
  //     const user = await prisma.user.findFirst({
  //       where: {
  //         oldId: lines.user_id,
  //       },
  //     });
  //     if (user) {
  //       userArray.push({ linesId: lines.id, userId: user.id });
  //     }
  //   }

  //   for (const newUser of userArray) {
  //     await prisma.lines.updateMany({
  //       where: {
  //         oldId: newUser.linesId,
  //       },
  //       data: {
  //         userId: newUser.userId,
  //       },
  //     });
  //   }
  // } catch (e: any) {
  //   return new NextResponse("lines:" + e, { status: 500 });
  // }

  //replace userId in between correctly
  // try {
  //   let userArray = [];

  //   for (const between of betweenArray) {
  //     const user = await prisma.user.findFirst({
  //       where: {
  //         oldId: between.user_id,
  //       },
  //     });
  //     if (user) {
  //       userArray.push({ betweenId: between.id, userId: user.id });
  //     }
  //   }

  //   for (const newUser of userArray) {
  //     await prisma.between.updateMany({
  //       where: {
  //         oldId: newUser.betweenId,
  //       },
  //       data: {
  //         userId: newUser.userId,
  //       },
  //     });
  //   }
  // } catch (e: any) {
  //   return new NextResponse("between:" + e, { status: 500 });
  // }

  //modify createdAt and updatedAt
  // try {
  //   for (const oldLines of linesArray) {
  //     const createdAt = new Date(oldLines.created_at);
  //     const updatedAt = new Date(oldLines.updated_at);

  //     await prisma.lines.updateMany({
  //       where: {
  //         oldId: oldLines.id,
  //       },
  //       data: {
  //         createdAt: createdAt,
  //         updatedAt: updatedAt,
  //       },
  //     });
  //   }
  // } catch (e: any) {
  //   return new NextResponse("lines:" + e, { status: 500 });
  // }

  // try {
  //   for (const oldBetween of betweenArray) {
  //     const createdAt = new Date(oldBetween.created_at);
  //     const updatedAt = new Date(oldBetween.updated_at);

  //     await prisma.between.updateMany({
  //       where: {
  //         oldId: oldBetween.id,
  //       },
  //       data: {
  //         createdAt: createdAt,
  //         updatedAt: updatedAt,
  //       },
  //     });
  //   }
  // } catch (e: any) {
  //   return new NextResponse("between:" + e, { status: 500 });
  // }

  // try {
  //   for (const oldLines of linesArray) {
  //     await prisma.lines.updateMany({
  //       where: {
  //         oldId: oldLines.id,
  //       },
  //       data: {
  //         isPrivate:
  //           oldLines.display === "show" || oldLines.display === null
  //             ? false
  //             : true,
  //       },
  //     });
  //   }
  // } catch (e: any) {
  //   return new NextResponse("lines:" + e, { status: 500 });
  // }

  // try {
  //   for (const oldBetween of betweenArray) {
  //     await prisma.between.updateMany({
  //       where: {
  //         oldId: oldBetween.id,
  //       },
  //       data: {
  //         isPrivate:
  //           oldBetween.display === "show" || oldBetween.display === null
  //             ? false
  //             : true,
  //       },
  //     });
  //   }
  // } catch (e: any) {
  //   return new NextResponse("between:" + e, { status: 500 });
  // }

  return new NextResponse("OK", { status: 200 });
}
