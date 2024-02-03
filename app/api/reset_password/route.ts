import prisma from "@/app/libs/prismadb";
import crypto from "node:crypto";
globalThis.crypto ??= crypto.webcrypto;

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;
  if (!email) {
    return new Response("Missing info", { status: 400 });
  }

  const nodemailer = require("nodemailer");
  const rememberToken = crypto.randomBytes(20).toString("hex");
  const rememberTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  let latestUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (latestUser) {
    await prisma.user.update({
      where: {
        id: latestUser.id,
      },
      data: {
        rememberToken,
        rememberTokenExpiry,
      },
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const mailHTML = `<p>以下のリンクをクリックしパスワードの変更をお願い致します。</p><br/><a href="${process.env.NEXTAUTH_URL}/reset_password?token=${rememberToken}">Click here to reset your password</a><br/><br/><p>rReadine</p>`;

  const mailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Readine パスワード変更",
    text: "リンクをクリックしパスワードの変更をお願い致します。",
    html: mailHTML,
  };
  try {
    await transporter.sendMail(mailData);
    return new Response("Email sent", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
