import bcrypt from "bcryptjs";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
globalThis.crypto ??= crypto.webcrypto;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const [exsistingUser, existingDeletedUser] = await Promise.all([
      prisma.user.findUnique({
        where: {
          email,
        },
      }),
      prisma.user.findFirst({
        where: {
          deletedEmail: email,
        },
        orderBy: {
          deletedAt: "desc", //Because there would be multiple deleted users with the same email
        },
      }),
    ]);

    if (exsistingUser) {
      return new NextResponse("existing");
    }

    if (
      existingDeletedUser?.reregisterExpiry &&
      existingDeletedUser?.reregisterExpiry >= new Date()
    ) {
      return new NextResponse("ban");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const rememberToken = crypto.randomBytes(20).toString("hex");
    const rememberTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    const user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: null,
        hashedPassword,
        rememberToken,
        rememberTokenExpiry,
      },
    });

    const nodemailer = require("nodemailer");

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
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
