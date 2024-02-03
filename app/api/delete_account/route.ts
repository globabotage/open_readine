import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const deletedUser = await prisma.user.updateMany({
      where: {
        id: currentUser.id,
      },
      data: {
        name: null,
        email: null,
        deletedName: currentUser.name,
        deletedEmail: currentUser.email,
        deletedAt: new Date(),
        reregisterExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    if (!currentUser.hashedPassword) {
      const preparedProviderUser = await prisma.user.create({
        data: {
          email: currentUser.email,
          name: null,
          image: null,
        },
      });

      const updateAccount = await prisma.account.updateMany({
        where: {
          userId: currentUser.id,
        },
        data: {
          userId: preparedProviderUser.id,
        },
      });

      //Why is the above area necessary? ;
      //The document of Account collection should not be deleted because the token remains in the provider side. And the process of authentication of provider (of Auth.js) is, at first,  Account's document is identified at firsy by the token given by the provider, second, User's document is identified by the userId of Account. And the point of here is "session" received tha velue of email from identified User document. So, if there is not email value in the document, the value of session will be null. But once the account is deleted, User's email fieled is updated to be null. So, for this, I need to prepare the new document of User which has the value of email for the time of re-registration.
    }

    return new NextResponse("Deleted", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
