import getSession from "@/actions/getSession";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return new NextResponse(null, { status: 200 });
    }

    const deletedUser = await prisma.user.findFirst({
      where: {
        AND: [
          { deletedEmail: session.user.email as string },
          { deletedAt: { not: null } },
        ],
      },
      orderBy: {
        deletedAt: "desc",
      },
    });

    if (deletedUser && deletedUser.reregisterExpiry) {
      if (deletedUser.reregisterExpiry >= new Date()) {
        return new NextResponse("ban", { status: 200 });
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },

      include: {
        accounts: true,
      },
    });

    if (user?.name) {
      return new NextResponse(null, { status: 200 });
    } else {
      let randomName;
      let existingName;

      do {
        randomName = Math.random().toString(36).slice(2.14); //The first two digits of a floating uumber contain "0." so I need to slice them.
        existingName = await prisma.user.findFirst({
          where: {
            name: randomName,
          },
        });
      } while (existingName); //if existingName is undefined, the roop will be finished.

      const updatePreparedUser = await prisma.user.update({
        where: { email: session.user.email as string },
        data: {
          name: randomName,
        },
      });

      //This area is related to the precess of deleting account. See the comment in api/delete_account/route.ts
    }

    return new NextResponse(null, { status: 200 });
  } catch (e: any) {
    return new NextResponse(e, { status: 500 });
  }
}
