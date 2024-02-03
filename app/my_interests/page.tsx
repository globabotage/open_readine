import getInterests from "@/actions/Interest/getInterests";
import getLinesByMyInterests from "@/actions/Lines/getLinesByMyInterests";
import getCurrentUser from "@/actions/getCurrentUser";
import Body from "@/components/Body";
import Redirector from "@/components/Redirector";
import Sidebar from "@/components/Sidebar";
import MyInterestsModal from "@/components/modals/MyInterestsModal";
import { Lines } from "@prisma/client";
import { Metadata } from "next";

interface SearchParams {
  linesId: string;
  page: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const writer = await getCurrentUser();

  return {
    title: writer?.name + "の関心 | Readine",
    description: "",
  };
}

const MyInterestsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const [currentUser, linesArray, interestArray] = await Promise.all([
    getCurrentUser(),
    getLinesByMyInterests(),
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
  const defaultPath = "/myinterests";
  const page = searchParams.page ? Number(searchParams.page) : 1;
  return (
    <>
      <div className="flex justify-center w-full h-auto overflow-hidde">
        {currentUser ? (
          <>
            <Sidebar
              params={{ bookId: "", interestId: "" }}
              myInterestPage
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
          </>
        ) : (
          <Redirector />
        )}
      </div>
      <MyInterestsModal currentUser={currentUser} />
    </>
  );
};

export default MyInterestsPage;
