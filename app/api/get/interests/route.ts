import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const interests = await prisma.interest.findMany();

    return NextResponse.json(interests);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}
