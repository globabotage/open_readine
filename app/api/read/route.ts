import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const {
      bookdata,
      pageBefore,
      pageAfter,
      lineBefore,
      lineAfter,
      motivation,
      isPrivate,
      imageUrls,
    } = body;

    const Between = body.between;
    const Interests = body.interests;
    //prismaのmodel名との重複を避けるためCammelCaseに変更

    if (
      !bookdata ||
      !pageBefore ||
      !pageAfter ||
      !lineBefore ||
      !lineAfter ||
      !motivation
    ) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingBook = await prisma.book.findUnique({
      where: {
        isbn: bookdata.isbn,
      },
    });

    let titleAlphabet = "";

    if (!existingBook) {
      const prompt = `
        次の書名、著者名を分析し、書名をローマ字で表現してください。その上で、書名のローマ字の部分だけを回答として表示して下さい。
        """
        書名：${bookdata.title}
        著者：${bookdata.author}
        
        `;
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4", //The models that I can use are ditermined based on the tier.I have to buy credit at least $5 to use gpt-4. See https://platform.openai.com/docs/guides/rate-limits/usage-tiers?context=tier-free
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      titleAlphabet = res.data.choices[0].message.content;
    }

    const book =
      existingBook ||
      (await prisma.book.create({
        data: {
          title: bookdata.title,
          titleAlphabet: titleAlphabet,
          author: bookdata.author,
          published: bookdata.published,
          publisher: bookdata.publisher,
          isbn: bookdata.isbn,
        },
      }));

    const lines = await prisma.lines.create({
      data: {
        userId: currentUser.id,
        bookId: book.id,
        pageBefore,
        pageAfter,
        lineBefore,
        lineAfter,
        motivation,
        isPrivate,
      },
    });

    for (const interest of Interests) {
      const existingInterest = await prisma.interest.findUnique({
        where: {
          name: interest,
        },
      });

      if (!existingInterest) {
        await prisma.interest.create({
          data: {
            name: interest,
          },
        });
      }
    }

    const interests = await prisma.interest.findMany({
      where: {
        name: {
          in: Interests,
        },
      },
    });

    const interestIds = interests.map((interest) => interest.id);

    const linesWithInterests = await prisma.lines.update({
      where: {
        id: lines.id,
      },
      data: {
        interestIds: {
          set: interestIds,
        },
      },
    });

    return NextResponse.json(linesWithInterests);
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse(error, { status: 500 });
  }
}
