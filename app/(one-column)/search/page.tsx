import getCurrentUser from "@/actions/getCurrentUser";

import { Metadata } from "next";
import getSearchedBetween from "@/actions/getSearchedBetween";
import getSearchedInterest from "@/actions/getSearchedInterest";
import getSearchedBooks from "@/actions/getSearchedBooks";
import getSearchedCinii from "@/actions/getSearchedCinii";
import SearchResult from "@/components/SearchResult";
import getInterests from "@/actions/Interest/getInterests";
import { redirect } from "next/navigation";

interface SearchParams {
  query: string;
  filter: string;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  return {
    title: searchParams.query + "- Search | Readine",
    description: "検索結果",
  };
}

const SearchPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const [
    readBooks,
    ciniiBooks,
    linesArray,
    linesByInterestArray,
    interestArrapy,
    currentUser,
  ] = await Promise.all([
    getSearchedBooks(searchParams.query),
    getSearchedCinii(searchParams.query),
    getSearchedBetween(searchParams.query),
    getSearchedInterest(searchParams.query),
    getInterests(),
    getCurrentUser(),
  ]);

  if (
    !searchParams.filter &&
    linesArray.length == 0 &&
    (readBooks.length > 0 || ciniiBooks.length > 0)
  ) {
    redirect("/search?query=" + searchParams.query + "&filter=本");
  } else if (
    !searchParams.filter &&
    readBooks.length === 0 &&
    ciniiBooks.length === 0 &&
    linesArray.length === 0 &&
    interestArrapy.length > 0
  ) {
    redirect("/search?query=" + searchParams.query + "&filter=関心");
  }

  const books = readBooks.concat(ciniiBooks);
  const defaultPath = "/search";
  return (
    <main className="w-full h-auto max-h-[95vh] md:max-h-[90vh] overflow-y-scroll">
      <SearchResult
        books={books}
        linesArray={linesArray}
        filter={searchParams.filter ? searchParams.filter : null}
        defaultPath={defaultPath}
        interestArray={interestArrapy}
        currentUser={currentUser}
        linesByInterestArray={linesByInterestArray}
      />
    </main>
  );
};

export default SearchPage;
