import getCurrentUser from "@/actions/getCurrentUser";
import getLinesForTop from "@/actions/Lines/getLinesForTop";
import getBooksForTop from "@/actions/Book/getBooksForTop";
import RedirectMyInterest from "@/components/RedirectMyInterest";
import SearchResult from "@/components/SearchResult";
import getInterests from "@/actions/Interest/getInterests";
import UrgingCard from "@/components/announce/UrgingCard";

interface SearchParams {
  filter: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [books, linesArray, interestArray, currentUser] = await Promise.all([
    getBooksForTop(),
    getLinesForTop(),
    getInterests(),
    getCurrentUser(),
  ]);

  const defaultPath = "/";
  return (
    <main className=" w-full flex flex-col items-center h-auto max-h-[92vh] overflow-y-scroll">
      {currentUser && currentUser.interestIds.length > 0 ? (
        <RedirectMyInterest currentUser={currentUser} />
      ) : (
        <>
          <div className="w-full md:w-2/3 lg:w-1/2 h-auto text-yt-white bg-yt-bg  py-3 ">
            <UrgingCard bgColor=" bg-gradient-to-r from-green-700/30 from-10%  to-indigo-700/30 to-90% " />
          </div>
          <SearchResult
            books={books}
            linesArray={linesArray}
            filter={searchParams.filter ? searchParams.filter : null}
            defaultPath={defaultPath}
            interestArray={interestArray}
            currentUser={currentUser}
          />
        </>
      )}
    </main>
  );
}
