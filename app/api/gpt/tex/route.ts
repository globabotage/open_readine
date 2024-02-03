import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { question } = body;

    const texPrompt = await prisma.prompts.findFirst({
      where: {
        title: "TeX",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const prompt = texPrompt?.prompt + question;
    let returnData = "";

    if (!currentUser) return new NextResponse("Unauthorized", { status: 401 });

    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
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

    returnData = res.data.choices[0].message.content;

    return new NextResponse(returnData, { status: 200 });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
