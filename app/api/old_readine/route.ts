import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      users,
      linesArray,
      interests,
      books,
      betweenArray,
      user_interests,
      interest_proposals,
    } = body;

    //user
    try {
      for (const user of users) {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              hashedPassword: null,
              oldId: user.id, //旧readineのid
            },
          });
        }
      }
    } catch (e: any) {
      return new NextResponse("user:" + e, { status: 500 });
    }

    try {
      //emmailVerifiedの更新
      for (const user of users) {
        const emailVerified =
          user.email_verified_at === null
            ? null
            : new Date(Date.parse(user.email_verified_at));
        await prisma.user.updateMany({
          where: {
            email: user.email,
          },
          data: {
            emailVerified,
          },
        });
      }
    } catch (e: any) {
      return new NextResponse("user_2:" + e, { status: 500 });
    }

    //book

    for (const book of books) {
      const existingBook = await prisma.book.findMany({
        where: {
          OR: [{ oldId: book.id }, { isbn: book.isbn }],
        },
      });

      if (existingBook.length === 0) {
        await prisma.book.create({
          data: {
            title: book.book_name,
            titleAlphabet: "",
            author: book.author,
            published: String(book.published),
            publisher: book.publisher,
            isbn: book.isbn,
            oldId: book.id, //旧readineのid
          },
        });
      }
    }

    //lines
    try {
      for (const lines of linesArray) {
        const existingLines = await prisma.lines.findMany({
          where: {
            oldId: lines.id,
          },
        });

        if (existingLines.length === 0) {
          const books = await prisma.book.findMany({
            where: {
              oldId: lines.book_id, //旧readineのid参照関係を用いて取得
            },
          });

          const users = await prisma.user.findMany({
            where: {
              oldId: lines.user_id, //旧readineのid参照関係を用いて取得
            },
          });

          const user = users[0];
          const book = books[0];

          await prisma.lines.create({
            data: {
              userId: user.id,
              bookId: book.id,
              pageBefore: String(lines.page),
              pageAfter: String(lines.page_second),
              lineBefore: lines.proposal,
              lineAfter: lines.proposal_second,
              motivation: lines.motiv,
              isPrivate:
                lines.display === "show" || lines.display === null
                  ? true
                  : false,
              oldId: lines.id,
            },
          });
        }
      }
    } catch (e: any) {
      return new NextResponse("lines:" + e, { status: 500 });
    }

    //between
    try {
      for (const between of betweenArray) {
        const existingBetween = await prisma.between.findMany({
          where: {
            oldId: between.id,
          },
        });

        if (existingBetween.length === 0) {
          const linesArray = await prisma.lines.findMany({
            where: {
              oldId: between.proposal_id,
            },
          });

          const lines = linesArray[0];

          const users = await prisma.user.findMany({
            where: {
              oldId: between.user_id,
            },
          });

          const user = users[0];

          await prisma.between.create({
            data: {
              userId: user.id,
              linesId: lines.id,
              content: between.answer,

              isPrivate: between.display == "show" ? true : false,
              oldId: between.id,
            },
          });
        }
      }
    } catch (e: any) {
      return new NextResponse("between:" + e, { status: 500 });
    }

    //interest
    try {
      for (const interest of interests) {
        const existingInterest = await prisma.interest.findMany({
          where: {
            oldId: interest.id,
          },
        });

        if (existingInterest.length === 0) {
          await prisma.interest.create({
            data: {
              name: interest.name,
              oldId: interest.id,
            },
          });
        }
      }
    } catch (e: any) {
      return new NextResponse("interest:" + e, { status: 500 });
    }

    //relation between lines and interest
    try {
      for (const ip of interest_proposals) {
        const Interest = await prisma.interest.findMany({
          where: {
            oldId: ip.interest_id,
          },
        });

        if (Interest.length === 0) {
          continue;
        }

        const interest = Interest[0];

        await prisma.lines.updateMany({
          where: {
            oldId: ip.proposal_id,
            //初回実行時には以下のNOT条件はコメントアウト。interestIdsフィールド自体が存在しない場合、このNOT条件があるとupdate対象から外される。現時点でprismaはフィールドの存在を直接チェックできない
            NOT: {
              interestIds: {
                has: interest.id,
              },
            },
          },
          data: {
            interestIds: {
              push: interest.id,
            },
          },
        });
      }
    } catch (e: any) {
      return new NextResponse("interest_proposals:" + e, { status: 500 });
    }

    //relation between user and interest
    try {
      for (const ui of user_interests) {
        const Interest = await prisma.interest.findMany({
          where: {
            oldId: ui.interest_id,
          },
        });

        if (Interest.length === 0) {
          continue;
        }

        const interest = Interest[0];

        await prisma.user.updateMany({
          where: {
            oldId: ui.user_id,

            //初回実行時には以下のNOT条件はコメントアウト。interestIdsフィールド自体が存在しない場合、このNOT条件があるとupdate対象から外される。現時点でprismaはフィールドの存在を直接チェックできない
            NOT: {
              interestIds: {
                has: interest.id,
              },
            },
          },
          data: {
            interestIds: {
              push: interest.id,
            },
          },
        });
      }
    } catch (e: any) {
      return new NextResponse("user_interests:" + e, { status: 500 });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
