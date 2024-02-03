import prisma from "@/app/libs/prismadb";
import crypto from "node:crypto";
globalThis.crypto ??= crypto.webcrypto;

export async function POST(request: Request) {
  try {
    const bodya = await request.json();
    const { email } = bodya;
    const nodemailer = require("nodemailer");

    const rememberToken = crypto.randomBytes(20).toString("hex");
    const rememberTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    const users = await prisma.user.update({
      where: {
        email,
      },
      data: {
        rememberToken,
        rememberTokenExpiry,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailHTML = `<p>以下のリンクをクリックすることでReadineの登録が完了します。</p><br/><a href="${process.env.NEXTAUTH_URL}/register?token=${rememberToken}">Click here to register</a><br/><br/><p>rReadine</p>`;

    const mailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Readine 登録リンク",
      text: "リンクをクリックすることでReadineの登録が完了します。",
      html: mailHTML,
    };
    try {
      await transporter.sendMail(mailData);
      return new Response("Email sent", { status: 200 });
    } catch (error) {
      return new Response("Internal Error", { status: 500 });
    }
  } catch (error: any) {
    return new Response("Internal Error", { status: 500 });
  }
}
