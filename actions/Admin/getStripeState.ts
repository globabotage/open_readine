import { NextResponse } from "next/server";
import getCurrentUser from "../getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getStripeState() {
  try {
    const admin = await prisma.admin.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    const isStripePause = admin?.isStripePause || false;

    return isStripePause;
  } catch (e: any) {
    return false;
  }
}
