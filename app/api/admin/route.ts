import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    const adminEmail = process.env.ADMIN_EMAIL;

    if (currentUser?.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { id, type, ids } = body;

    if (type === "check_lines") {
      await prisma.checkedPost.create({
        data: {
          linesId: id,
          approved: true,
        },
      });
    }

    if (type === "check_lines_array") {
      for (const id of ids) {
        await prisma.checkedPost.create({
          data: {
            linesId: id,
            approved: true,
          },
        });
      }
    }

    if (type === "check_between") {
      await prisma.checkedPost.create({
        data: {
          betweenId: id,
          approved: true,
        },
      });
    }

    if (type === "check_between_array") {
      for (const id of ids) {
        await prisma.checkedPost.create({
          data: {
            betweenId: id,
            approved: true,
          },
        });
      }
    }

    if (type === "reject_lines") {
      await prisma.checkedPost.create({
        data: {
          linesId: id,
          approved: false,
        },
      });
    }

    if (type === "reject_between") {
      await prisma.checkedPost.create({
        data: {
          betweenId: id,
          approved: false,
        },
      });
    }

    if (type === "update_lines") {
      await prisma.checkedPost.updateMany({
        where: { linesId: id },
        data: {
          approved: true,
        },
      });
    }

    if (type === "update_between") {
      await prisma.checkedPost.updateMany({
        where: { betweenId: id },
        data: {
          approved: true,
        },
      });
    }

    if (type === "reject_user") {
      await prisma.rejectedUser.create({
        data: {
          userId: id,
        },
      });
    }

    if (type === "remove_rejected") {
      await prisma.rejectedUser.delete({
        where: { id: id },
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
