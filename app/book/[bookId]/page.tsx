import type { Metadata } from "next";
import getBookById from "@/actions/Book/getBookById";

import Body from "@/components/Body";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";
import getCurrentUser from "@/actions/getCurrentUser";
import getInterests from "@/actions/Interest/getInterests";
import getLinesByBookId from "@/actions/Lines/getLinesByBookId";
import { Interest, Lines } from "@prisma/client";
import Redirector from "@/components/Redirector";

export interface Params {
  bookId: string;
  interestId: string;
}
export interface SearchParams {
  linesId: string;
  page: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const book = await getBookById(params.bookId);

  return {
    title: book?.title,
    description:
      "『" +
      book?.title +
      "』の内容について、読まれた行間について表示しています。",
  };
}

const BookPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const linesId = searchParams.linesId;
  const [currentUser, linesArray, interestArray] = await Promise.all([
    getCurrentUser(),
    getLinesByBookId(params.bookId),
    getInterests(),
  ]);

  let lines = null;
  if (linesArray?.length > 0) {
    if (linesId) {
      lines = linesArray.find((lines: Lines) => lines.id === linesId);
    } else {
      lines = linesArray[0];
    }
  }

  const defaultPath = "/book/" + params.bookId;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  return (
    <>
      {linesArray ? (
        <div className="flex justify-center w-full h-auto overflow-hidden">
          <Sidebar
            params={params}
            bookPage
            linesId={linesId}
            linesArray={linesArray}
            interestArray={interestArray}
            page={page}
          />

          <Body
            lines={lines}
            currentUser={currentUser}
            interestArray={interestArray}
            defaultPath={defaultPath}
            page={page}
          />
        </div>
      ) : (
        <Redirector />
      )}
    </>
  );
};

export default BookPage;
