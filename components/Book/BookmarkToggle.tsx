"use client";

import { BsFillBookmarkCheckFill, BsFillBookmarkFill } from "react-icons/bs";
import MiniLoader from "../loader/MiniLoader";
import useBookmarkBook from "@/hooks/bookmark/useBookmarkBook";
import { SafeBook } from "@/types";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import useLoginModal from "@/hooks/modal/useLoginModal";

interface BookmarkToggleProps {
  bookdata: SafeBook;
  currentUser?: User | null;
  sidebar?: boolean;
}

const BookmarkToggle: React.FC<BookmarkToggleProps> = ({
  currentUser,
  bookdata,
  sidebar,
}) => {
  const pathname = usePathname();
  const { onOpen } = useLoginModal();
  const { hasBookmarkBook, toggleBookmarkBook, isBookmarkLoading } =
    useBookmarkBook({
      currentUser: currentUser as User,
      bookId: bookdata.id as string,
    });
  return (
    <>
      {" "}
      <div className="basis-1/6 flex flex-row justify-end items-start pr-1 pt-1 overflow-visible">
        {currentUser && (sidebar || pathname.includes("bookmark")) && (
          <>
            {" "}
            {isBookmarkLoading && <MiniLoader />}
            {!isBookmarkLoading && hasBookmarkBook && (
              <BsFillBookmarkCheckFill
                size={18}
                className="peer cursor-pointer text-indigo-300 hover:text-yt-white hover:scale-110 transform duration-200"
                onClick={toggleBookmarkBook}
              />
            )}
            {!isBookmarkLoading && !hasBookmarkBook && (
              <BsFillBookmarkFill
                size={18}
                className="peer cursor-pointer hover:text-indigo-300 hover:scale-110 transform duration-200"
                onClick={toggleBookmarkBook}
              />
            )}
            <div className="hidden peer-hover:inline-block w-0 h-0 overflow-visible relative">
              <div className="w-auto h-auto px-2 py-1 absolute right-0 bg-indigo-500/70 text-yt-white text-xs rounded-2xl text-center mt-5">
                Bookmark
              </div>
            </div>
          </>
        )}
        {!currentUser && (
          <div className="flex flex-col items-end w-auto">
            <BsFillBookmarkFill
              size={22}
              className="peer cursor-pointer text-yt-white hover:text-indigo-300  hover:scale-110 transform duration-200"
              onClick={onOpen}
            />
            <div className="hidden peer-hover:inline-block w-0 h-0 overflow-visible relative">
              <div className="w-auto h-auto px-2 py-1 absolute right-0 bg-indigo-500/70 text-yt-white  text-xs rounded-2xl text-center mt-2">
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
