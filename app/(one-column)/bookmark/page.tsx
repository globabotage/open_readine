import getCurrentUser from "@/actions/getCurrentUser";

import { Metadata } from "next";
import BookmarkHeader from "./_components/BookmarkHeader";
import getBooksByBookmark from "@/actions/Book/getBooksByBookmark";
import getLinesByBookmark from "@/actions/Lines/getLinesByBookmark";
import getInterests from "@/actions/Interest/getInterests";
import SearchResult from "@/components/SearchResult";
import Redirector from "@/components/Redirector";

export async function generateMetadata(): Promise<Metadata> {
  const writer = await getCurrentUser();

  return {
    title: writer?.name + "のブックマーク | Readine",
    description: "",
  };
}

interface SearchParams {
  filter: string;
}

const BookmarkPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const [books, linesArray, interestArray, currentUser] = await Promise.all([
    getBooksByBookmark(),
    getLinesByBookmark(),
    getInterests(),
    getCurrentUser(),
  ]);
  const defaultPath = "/bookmark";
  return (
    <div className="">
      <main className="w-full h-auto max-h-[92vh] overflow-y-scroll">
        {currentUser ? (
          <>
            <BookmarkHeader currentUser={currentUser} />
            <SearchResult
              books={books}
              linesArray={linesArray}
              filter={searchParams.filter ? searchParams.filter : null}
              defaultPath={defaultPath}
              interestArray={interestArray}
              currentUser={currentUser}
            />
          </>
        ) : (
          <Redirector />
        )}
      </main>
    </div>
  );
};

export default BookmarkPage;
