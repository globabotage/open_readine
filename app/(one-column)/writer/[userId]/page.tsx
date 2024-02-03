import getCurrentUser from "@/actions/getCurrentUser";

import getWriterById from "@/actions/getWriterById";
import WriterCard from "../_components/WriterCard";
import WriterModal from "@/components/modals/WriterModal";
import { Metadata } from "next";
import getBooksByUserId from "@/actions/Book/getBooksByUserId";
import getLinesByUserId from "@/actions/Lines/getLinesByUserId";
import getInterests from "@/actions/Interest/getInterests";
import SearchResult from "@/components/SearchResult";

interface Params {
  userId: string;
}
interface SearchParams {
  filter: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const writer = await getWriterById(params);

  return {
    title: writer?.name + " | Readine",
    description: "",
  };
}

const WriterPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const [books, linesArray, interestArray, writer, currentUser] =
    await Promise.all([
      getBooksByUserId(params),
      getLinesByUserId(params),
      getInterests(),
      getWriterById(params),
      getCurrentUser(),
    ]);

  const isCurrentUser = currentUser?.id === writer?.id;
  const defaultPath = "/writer";
  return (
    <main className="w-full h-auto max-h-[92vh] overflow-y-scroll">
      <div className="w-full h-auto  bg-yt-bg sticky  ">
        <WriterCard writer={writer} currentUser={currentUser} />
      </div>
      <SearchResult
        books={books}
        linesArray={linesArray}
        filter={searchParams.filter ? searchParams.filter : null}
        defaultPath={defaultPath}
        interestArray={interestArray}
        currentUser={currentUser}
      />
      <WriterModal isCurrentUser={isCurrentUser} writer={writer} />
    </main>
  );
};

export default WriterPage;
