import { Params } from "@/app/book/[bookId]/page";
import dynamic from "next/dynamic";
import { Interest, Lines } from "@prisma/client";
import SidebarHead from "./SidebarHead";

// import LinesList from "./Lines/LinesList";

const LinesList = dynamic(() => import("./Lines/LinesList"), {
  ssr: false,
});
//It's effective to use dynamic import for speed up the initial loading time.

interface SidebarProps {
  params: Params;
  linesArray: Lines[];
  interestArray: Interest[];
  linesId: string;
  page: number;
  bookPage?: boolean;
  interestPage?: boolean;
  myInterestPage?: boolean;
}
const Sidebar: React.FC<SidebarProps> = async ({
  params,
  linesArray,
  interestArray,
  linesId,
  page,
  bookPage,
  interestPage,
  myInterestPage,
}) => {
  let defaultPath = "";
  if (bookPage) {
    defaultPath = "/book/" + params.bookId;
  } else if (interestPage) {
    defaultPath = "/interest/" + params.interestId;
  } else {
    defaultPath = "/my_interests";
  }
  const isHeaderThin = myInterestPage || interestPage;

  const totalPages = Math.ceil(linesArray?.length / 10);
  let pages =
    totalPages > 1 ? Array.from({ length: totalPages }, (_, i) => i + 1) : null;

  let slicedLinesArray = linesArray;
  if (totalPages > 1) {
    if (page === totalPages) {
      slicedLinesArray = linesArray.slice(page * 10 - 10, linesArray.length);
    }
    if (page < totalPages) {
      slicedLinesArray = linesArray.slice(page * 10 - 10, page * 10);
    }
  }

  return (
    <>
      <section
        className={`sidebar md:hidden fixed top-0 left-0 w-full h-full bg-black z-20
          ${linesId ? "hidden" : "block"}
        `}
      >
        <div className="flex flex-row items-center ">
          <SidebarHead
            params={params}
            page={page}
            pages={pages}
            defaultPath={defaultPath}
            interestPage={interestPage}
            bookPage={bookPage}
            myInterestPage={myInterestPage}
          />
        </div>

        <div className="flex flex-col items-center justify-start w-full h-auto max-h-[80vh]   bg-black text-yt-white px-1  pt-0 pb-3 overflow-y-auto">
          <LinesList
            linesArray={slicedLinesArray}
            interestArray={interestArray}
            defaultPath={defaultPath}
            linesId={linesId}
            page={page}
            mobile
            sidebar
          />
        </div>
      </section>

      <section
        className={`sidebar hidden md:flex w-1/4 min-w-[350px] h-full
        `}
      >
        <div className="fixed lef-0  w-1/4 min-w-[350px]  bg-black z-10">
          <SidebarHead
            params={params}
            interestPage={interestPage}
            page={page}
            pages={pages}
            defaultPath={defaultPath}
            bookPage={bookPage}
            myInterestPage={myInterestPage}
          />
        </div>
        <div
          className={`flex flex-col items-center justify-start min-h-screen max-h-screen bg-black text-yt-white px-1  pb-16 w-full h-auto overflow-y-auto 
          ${isHeaderThin ? "pt-[100px]" : "pt-[140px]"}
          `}
        >
          <LinesList
            linesArray={slicedLinesArray}
            interestArray={interestArray}
            defaultPath={defaultPath}
            linesId={linesId}
            page={page}
            sidebar
          />
        </div>
      </section>
    </>
  );
};

export default Sidebar;
