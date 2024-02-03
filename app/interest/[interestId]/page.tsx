import getInterestById from "@/actions/Interest/getInterestById";

import { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import Body from "@/components/Body";
import getInterests from "@/actions/Interest/getInterests";
import getLinesByInterestId from "@/actions/Lines/getLinesByInterestId";
import { Lines } from "@prisma/client";
import getCurrentUser from "@/actions/getCurrentUser";
import Redirector from "@/components/Redirector";

interface Params {
  bookId: string;
  interestId: string;
}
interface SearchParams {
  linesId: string;
  page: string;
}
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const interest = await getInterestById(params);

  return {
    title: interest?.name + " | Readine",
    description:
      "「" +
      interest?.name +
      "」という関心に関わる書籍・行間を表示しています。",
  };
}
const InterestPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const [currentUser, linesArray, interestArray] = await Promise.all([
    getCurrentUser(),
    getLinesByInterestId(params.interestId),
    getInterests(),
  ]);

  const linesId = searchParams.linesId;

  let lines = null;
  if (linesArray?.length > 0) {
    if (linesId) {
      lines = linesArray.find((lines: Lines) => lines.id === linesId);
    } else {
      lines = linesArray[0];
    }
  }
  const defaultPath = "/interest/" + params.interestId;

  const page = searchParams.page ? Number(searchParams.page) : 1;

  return (
    <>
      {linesArray ? (
        <div className="flex justify-center w-full h-auto overflow-hidde">
          <Sidebar
            params={params}
            interestPage
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

export default InterestPage;
