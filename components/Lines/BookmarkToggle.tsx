"use client";

import { BsFillBookmarkCheckFill, BsFillBookmarkFill } from "react-icons/bs";
import MiniLoader from "../loader/MiniLoader";
import useBookmarkLines from "@/hooks/bookmark/useBookmarkLines";
import { SafeLines } from "@/types";
import { User } from "@prisma/client";
import useLoginModal from "@/hooks/modal/useLoginModal";

interface BookmarkToggleProps {
  lines: SafeLines;
  currentUser?: User | null;
}
const BookmarkToggle: React.FC<BookmarkToggleProps> = ({
  lines,
  currentUser,
}) => {
  const { onOpen } = useLoginModal();
  const { hasBookmarkLines, toggleBookmarkLines, isBookmarkLoading } =
    useBookmarkLines({
      currentUser: currentUser as User,
      linesId: lines.id,
    });

  return (
    <>
      <div className="basis-1/12 min-h-[50px] flex flex-col items-center justify-end pr-0.5 overflow-visible">
        {currentUser && (
          <>
            {" "}
            <div className="w-auto flex flex-col  ">
              {isBookmarkLoading && (
                <div className="w-full h-full flex items-center justify-center mr-2">
                  <MiniLoader />
                </div>
              )}
              {!isBookmarkLoading && hasBookmarkLines && (
                <BsFillBookmarkCheckFill
                  size={22}
                  className="peer cursor-pointer text-indigo-300 hover:text-yt-white hover:scale-110 transform duration-200"
                  onClick={toggleBookmarkLines}
                />
              )}

              {!isBookmarkLoading && !hasBookmarkLines && (
                <BsFillBookmarkFill
                  size={22}
                  className="peer cursor-pointer text-yt-white hover:text-indigo-300 hover:scale-110  transform duration-200"
                  onClick={toggleBookmarkLines}
                />
              )}
              <div className="hidden peer-hover:inline-block w-0 h-0 overflow-visible relative">
                <div className="w-auto h-auto px-2 py-1 absolute right-0 bg-indigo-500/70 text-yt-white text-xs rounded-2xl text-center ">
                  Bookmark
                </div>
              </div>
            </div>
          </>
        )}
        {!currentUser && (
          <div className="flex flex-col items-end w-auto">
            <BsFillBookmarkFill
              size={22}
              className="peer cursor-pointer text-yt-white hover:text-indigo-300 hover:scale-110  transform duration-200"
              onClick={onOpen}
            />
            <div className="hidden peer-hover:inline-block w-0 h-0 overflow-visible relative">
              <div className="w-auto h-auto px-2 py-1 absolute right-0 bg-indigo-500/70 text-yt-white text-xs rounded-2xl text-center mt-2">
                Bookmark
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookmarkToggle;
