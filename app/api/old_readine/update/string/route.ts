import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  // try {
  //   const betweenArray = await prisma.between.findMany({
  //     where: {
  //       content: {
  //         contains: "boldsymbol",
  //       },
  //     },
  //   });

  //   for (const between of betweenArray) {
  //     const updatedContent = between?.content?.replace(/boldsymbol/g, "mathbf");

  //     await prisma.between.update({
  //       where: {
  //         id: between.id,
  //       },
  //       data: {
  //         content: updatedContent,
  //       },
  //     });
  //   }
  // } catch (e: any) {
  //   return new NextResponse(e, { status: 500 });
  // }

  // try {
  //   const linesArray = await prisma.lines.findMany({
  //     where: {
  //       OR: [
  //         {
  //           lineBefore: {
  //             contains: "boldsymbol",
  //           },
  //         },
  //         {
  //           lineAfter: {
  //             contains: "boldsymbol",
  //           },
  //         },
  //         {
  //           motivation: {
  //             contains: "boldsymbol",
  //           },
  //         },
  //       ],
  //     },
  //   });

  //   for (const lines of linesArray) {
  //     const updatedLineBefore = lines.lineBefore.replace(
  //       /boldsymbol/g,
  //       "mathbf"
  //     );
  //     const updatedLineAfter = lines.lineAfter.replace(/boldsymbol/g, "mathbf");
  //     const updatedMotivation = lines.motivation.replace(
  //       /boldsymbol/g,
  //       "mathbf"
  //     );

  //     await prisma.lines.update({
  //       where: {
  //         id: lines.id,
  //       },
  //       data: {
  //         lineBefore: updatedLineBefore,
  //         lineAfter: updatedLineAfter,
  //         motivation: updatedMotivation,
  //       },
  //     });
  //   }
  // } catch (e: any) {
  //   return new NextResponse(e, { status: 500 });
  // }

  return new NextResponse("OK", { status: 200 });
}
