import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { recaptchaToken } = body;
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`;

    const response = await axios.post(url);
    if (response.data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (e: any) {
    return new NextResponse(e, { status: 500 });
  }
}
