import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
export async function POST(request: Request) {
  const bodyy = await request.json();
  const { type, value, providerEmail } = bodyy;

  let isDuplicated = undefined;

  if (type === "email") {
    isDuplicated = await prisma.user.findUnique({
      where: {
        email: value,
      },
    });
    if (isDuplicated) {
      return new Response("Duplicated", { status: 200 });
    }
  }
  if (type === "name") {
    isDuplicated = await prisma.user.findFirst({
      where: {
        name: value,
      },
    });
    if (isDuplicated) {
      return new Response("Duplicated", { status: 200 });
    }
  }

  if (type === "name") {
    isDuplicated = await prisma.user.findFirst({
      where: {
        name: value,
      },
    });
    if (isDuplicated) {
      return new Response("Duplicated", { status: 200 });
    }
  }

  if (type === "change_name") {
    const currentUser = await getCurrentUser();
    isDuplicated = await prisma.user.findFirst({
      where: {
        AND: [
          {
            name: value,
          },
          {
            NOT: {
              id: currentUser?.id,
            },
          },
        ],
      },
    });
    if (isDuplicated) {
      return new Response("Duplicated", { status: 200 });
    }
  }

  if (type === "provider") {
    isDuplicated = await prisma.user.findMany({
      where: {
        name: value,
      },
    });
    if (isDuplicated.length > 1) {
      let randomName;
      let existingName;

      do {
        randomName = Math.random().toString(36).slice(2.14); //The first two digits of a floating uumber contain "0." so I need to slice them.
        existingName = await prisma.user.findFirst({
          where: {
            name: randomName,
          },
        });
      } while (existingName); //if existingName is undefined, the roop will be finished.

      await prisma.user.update({
        where: {
          email: providerEmail,
        },
        data: {
          name: randomName,
        },
      });
    }
  }

  if (isDuplicated) {
    return new Response("Duplicated", { status: 200 });
  }
  return new Response("Not duplicated", { status: 200 });
}
