import { SafeBook, SafeLines } from "@/types";
import { Interest, User } from "@prisma/client";
import SearchFilterBar from "@/app/(one-column)/search/_components/SearchFilterBar";
import BookmarkFilterBar from "@/app/(one-column)/bookmark/_components/BookmarkFilterBar";
import WriterFilterBar from "@/app/(one-column)/writer/_components/WriterFilterBar";
import { BsLightbulbFill } from "react-icons/bs";
import TopFilterBar from "@/app/(one-column)/_components/TopFilterBar";

import BookList from "./Book/BookList";
import ReadMore from "@/app/(one-column)/_components/ReadMore";
import dynamic from "next/dynamic";

// import LinesList from "./Lines/LinesList";

const LinesList = dynamic(() => import("./Lines/LinesList"), {
  ssr: false,
});
//It's effective to use dynamic import for speed up the initial loading time.

interface SearchResultProps {
  books: SafeBook[];
  linesArray: SafeLines[];
  filter: string | null;
  defaultPath: string;
  interestArray?: Interest[];
  currentUser?: User | null;
  linesByInterestArray?: SafeLines[];
}

const SearchResult: React.FC<SearchResultProps> = ({
  books,
  linesArray,
  filter,
  defaultPath,
  interestArray,
  currentUser,
  linesByInterestArray,
}) => {
  const limit = 150;
  const isBetween = filter === "行間" || filter === null;

  return (
    <>
      <div className="flex w-full h-auto justify-center">
        <div className="flex flex-col items-center justify-center w-full md:w-2/3 xl:w-1/2  md:mt-3  md:px-0 text-yt-white relative pb-6">
          <div
            className={`w-full  h-auto text-rose-50 sticky top-0 z-10 
          `}
          >
            {defaultPath.includes("search") && <SearchFilterBar />}
            {defaultPath.includes("bookmark") && <BookmarkFilterBar />}
            {defaultPath.includes("writer") && <WriterFilterBar />}
            {defaultPath === "/" && <TopFilterBar />}
          </div>
          <div className="w-full h-auto px-2  overflow-y-auto ">
            {defaultPath.includes("writer") && currentUser && (
              <div className=" w-full h-auto flex flex-row justify-center pb-5 ">
                <div className=" text-readine-green bg-yt-component rounded-2xl px-5 py-1 flex items-center">
                  <BsLightbulbFill size={12} />
                  <span className="ml-1 text-[13px]">
                    投稿の公開が制限されている場合があります
                  </span>
                </div>
              </div>
            )}

            {filter === "本" &&
              books &&
              books.length > 0 &&
              books.length <= limit && (
                <BookList books={books} currentUser={currentUser} />
              )}
            {isBetween &&
              linesArray.length > 0 &&
              linesArray.length <= limit && (
                <LinesList
                  linesArray={linesArray}
                  interestArray={interestArray}
                />
              )}

            {filter === "関心" &&
              linesByInterestArray &&
              linesByInterestArray.length > 0 &&
              linesByInterestArray.length <= limit && (
                <LinesList
                  linesArray={linesByInterestArray}
                  interestArray={interestArray}
                />
              )}

            {((filter === "本" && books && books.length === 0) ||
              (isBetween && linesArray && linesArray.length === 0) ||
              (filter === "関心" &&
                linesByInterestArray &&
                linesByInterestArray.length === 0)) && (
              <div className="text-center">No results found</div>
            )}
            {((filter === "本" && books && books.length > limit) ||
              (isBetween && linesArray && linesArray.length > limit) ||
              (filter === "関心" &&
                linesByInterestArray &&
                linesByInterestArray.length > limit)) && (
              <div className="text-center">Please refine your search</div>
            )}
          </div>
          {defaultPath === "/" && <ReadMore />}
        </div>
      </div>
    </>
  );
};

export default SearchResult;
