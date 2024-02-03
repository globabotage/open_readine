import Link from "next/link";
import { BiSolidBookAlt } from "react-icons/bi";
import { SafeLines } from "@/types";
import PrivateIcon from "../preview/PrivateIcon";
import { Interest, User } from "@prisma/client";
import ThanksButton from "../ThanksButton";
import dayjs from "dayjs";
import EditorIcon from "../editor/EditorIcon";
import InterestList from "../InterestList";

import Preview from "../preview/Preview";

interface LinesCardProps {
  lines: SafeLines;
  currentUser?: User | null;

  interestArray?: Interest[];
  defaultPath?: string;
  isListed?: boolean;
  isSelected?: boolean;
  isFirst?: boolean;
  children?: React.ReactNode;
  page?: number;
}
const LinesCard: React.FC<LinesCardProps> = ({
  lines,
  currentUser,

  interestArray,
  defaultPath,
  isListed,
  isSelected,
  isFirst,
  children,
  page,
}) => {
  let filteredInterests: Interest[] = [];
  if (interestArray) {
    const interestIdsSet = new Set(lines.interestIds);
    filteredInterests = interestArray?.filter((interest) =>
      interestIdsSet.has(interest.id)
    );
  }
  const isBookPage =
    defaultPath?.includes("book") && !defaultPath.includes("bookmark");

  const pageQuery = page ? "&page=" + page : "";
  return (
    <section className={`w-full flex flex-col justify-center items-center `}>
      {!isBookPage && (
        <div className={`w-full pl-2 pb-0.5`}>
          <Link
            className={`flex items-center space-x-1  font-semibold text-green-300/80 hover:text-yt-white
                ${isListed ? "text-sm " : "text-base"}`}
            href={`/book/${lines?.book?.id}`}
          >
            <BiSolidBookAlt />
            <h2>
              {isListed
                ? lines?.book?.title.slice(0, 23) + "..."
                : lines?.book?.title}
            </h2>
          </Link>{" "}
          {!isListed && !isBookPage && (
            <h2
              className={`text-sm pl-5 mb-1
              `}
            >
              {lines?.book?.author}&nbsp;
              <span className="text-yt-text-gray">
                {lines?.book?.published}
              </span>
              &nbsp;
              {lines?.book?.publisher}
            </h2>
          )}
        </div>
      )}
      <Link
        className={`group flex flex-row w-full h-auto items-start justify-start font-semibold text-yt-white py-2 px-2 rounded-xl  cursor-pointer border-2
        border-yt-atom border-opacity-50 shadow-md shadow-black/60 mt-2
        ${isListed && "hover:bg-yt-atom"}
        ${
          isListed && (isSelected || isFirst)
            ? "bg-yt-atom/70"
            : " bg-yt-component/70"
        }
        `}
        href={
          defaultPath
            ? defaultPath + "?linesId=" + lines.id + pageQuery
            : "/book/" + lines?.book?.id + "?linesId=" + lines.id + pageQuery
        }
        // onClick={isLinesOnly ? onClick : () => {}}
      >
        <section
          className={`flex flex-col h-auto overflow-x-hidden
        ${isListed ? "basis-full" : "basis-11/12"}`}
        >
          <div className="w-full  text-left flex space-x-2 items-center mb-0.5">
            {isListed && lines?.isPrivate && <PrivateIcon />}
          </div>

          <div className="w-full   break-words flex flex-col space-y-0.5">
            <div className="flex flex-row items-start ">
              <div>
                <span className=" text-sm font-light">p.</span>
                {lines?.pageBefore} &nbsp;
              </div>
              <div className="basis-11/12 group-hover:opacity-75  ">
                <Preview value={lines?.lineBefore} height={83} />
              </div>
            </div>
            <div
              className={`w-full  text-right
                ${isListed ? "pr-3" : "pr-3 md:pr-8 lg:pr-12 xl:pr-16"}
            `}
            >
              <span
                className={`text-[13px] font-semibold text-indigo-200/80
              
              `}
              >
                …と、
              </span>
            </div>
            <div className="flex flex-row items-start">
              <div>
                <span className="text-sm font-light">p.</span>
                {lines?.pageAfter} &nbsp;
              </div>
              <div className="basis-11/12 group-hover:opacity-75">
                <Preview value={lines?.lineAfter} height={83} />
              </div>
            </div>
            <div
              className={`w-full  text-right
              ${isListed ? "pr-3" : "pr-3 md:pr-8 lg:pr-12 xl:pr-16"}
            `}
            >
              <span className=" text-[13px] font-semibold text-indigo-200/80">
                …とのあいだの行間
              </span>
            </div>
          </div>
        </section>
        {children}
      </Link>{" "}
      {!isListed && (
        <section className="w-full flex justify-end px-2 my-2">
          <div className="w-[97%] flex flex-col rounded-t-lg rounded-bl-lg bg-yt-component py-2 px-3 overflow-visible border-2 border-indigo-300/50 shadow-md shadow-black/60">
            <div className="w-full text-[13px] font-semibold text-indigo-200/80 pl-5">
              よみたい動機
            </div>
            <Preview
              value={lines?.motivation}
              height={lines?.motivation?.length < 100 ? 65 : undefined}
            />

            <div className="flex flex-row justify-end items-center w-full">
              {lines?.isPrivate && (
                <div className="mr-2">
                  <PrivateIcon />
                </div>
              )}

              {}
              {lines?.user?.deletedAt ? (
                <div className="group flex flex-col pr-3 cursor-pointer  w-auto">
                  <div className="text-indigo-300 hover:text-indigo-400 font-semibold">
                    Readine
                  </div>

                  <div className="hidden h-0 w-0 group-hover:inline-block overflow-visible ">
                    <div className="w-[150px] h-auto px-2 py-1 rounded-md bg-yt-atom text-xs">
                      Unsubscribed User
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  className="pr-3 cursor-pointer text-indigo-300 hover:text-indigo-400 font-semibold"
                  href={`/writer/${lines?.user?.id}`}
                >
                  {lines?.user?.name}
                </Link>
              )}

              {!lines?.user?.deletedAt &&
                lines.user &&
                currentUser?.id !== lines?.user?.id && (
                  <ThanksButton
                    destinationUser={lines?.user}
                    loggedIn={currentUser ? true : false}
                  />
                )}

              <div className="w-auto font-light text-yt-text-gray text-sm flex flex-row items-center">
                <div> {dayjs(lines?.updatedAt).format("YYYY/M/D")}</div>
                {lines?.updatedAt !== lines?.createdAt && (
                  <div className="ml-2 text-[13px]">編集済</div>
                )}
              </div>

              {currentUser?.id === lines?.user?.id && <EditorIcon />}
            </div>
          </div>
        </section>
      )}
      {filteredInterests.length > 0 && (
        <aside className="w-full pr-2 -mt-1">
          <InterestList interestArray={filteredInterests} />
        </aside>
      )}
    </section>
  );
};

export default LinesCard;
