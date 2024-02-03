import prisma from "@/app/libs/prismadb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { newPrompt, isDelete } = body;

    if (!isDelete) {
      if (!newPrompt.id) {
        await prisma.prompts.create({
          data: {
            title: newPrompt.title,
            prompt: newPrompt.prompt,
          },
        });
      } else {
        await prisma.prompts.update({
          where: {
            id: newPrompt.id,
          },
          data: {
            title: newPrompt.title,
            prompt: newPrompt.prompt,
          },
        });
      }
    } else {
      await prisma.prompts.delete({
        where: {
          id: newPrompt.id,
        },
      });
    }

    return new NextResponse("updated", { status: 200 });
  } catch (e: any) {
    return new NextResponse(e, { status: 500 });
  }
}
