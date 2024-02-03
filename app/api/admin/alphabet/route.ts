import axios from "axios";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { book } = body;

    let titleAlphabet = "";
    const prompt = `
        次の書名、著者名を分析し、書名をローマ字（英字）で表現してください。その上で、あなたが表現したローマ字（英字）の部分だけを回答として表示して下さい。
        """
        書名：${book.title}
        著者：${book.author}
        
        `;
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", //The models that I can use are ditermined based on the tier.I have to buy credit at least $5 to use gpt-4. See https://platform.openai.com/docs/guides/rate-limits/usage-tiers?context=tier-free
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    titleAlphabet = res.data.choices[0].message.content;

    const updatedBook = await prisma.book.update({
      where: {
        id: book.id,
      },
      data: {
        titleAlphabet,
      },
    });

    return new NextResponse("updated", { status: 200 });
  } catch (e: any) {
    return new NextResponse(e, { status: 500 });
  }
}
