import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { num } = body;
    const interests = await prisma.interest.findMany();
    const randomInterests = interests
      .sort(() => Math.random() - Math.random())
      .slice(0, num);

    let interestsHasLines = [];
    for (let i = 0; i < randomInterests.length; i++) {
      const lines = await prisma.lines.findMany({
        where: {
          AND: [
            {
              interestIds: {
                has: interests[i].id,
              },
            },
            { isPrivate: false },
          ],
        },
      });
      if (lines.length > 0) {
        interestsHasLines.push(interests[i]);
      }
    }

    return NextResponse.json(interestsHasLines);
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
