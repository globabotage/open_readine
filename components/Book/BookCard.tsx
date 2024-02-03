import { SafeBook } from "@/types";
// import BookReadInfo from "./BookReadInfo";
import CreateButton from "./CreateButton";
import BookmarkToggle from "./BookmarkToggle";
import BookTitle from "./BookTitle";
import { User } from "@prisma/client";
import dynamic from "next/dynamic";
const BookReadInfo = dynamic(() => import("./BookReadInfo"), { ssr: false });
//It's not for rendering speed but for avoiding the error "TypeError: Cannot read properties of undefined (reading 'isKeyObject')"

interface BookCardProps {
  bookdata: SafeBook;
  currentUser?: User | null;
  sidebar?: boolean;
  readPage?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  bookdata,
  currentUser,
  sidebar,
  readPage,
}) => {
  return (
    <section
      className={`flex flex-col justify-start items-center py-3 px-3 w-full  text-yt-text-gray   rounded-xl h-auto 
        ${sidebar || readPage ? "bg-transparent" : "bg-yt-component "}
        ${
          !sidebar &&
          !readPage &&
          bookdata.lines &&
          bookdata.lines.length > 0 &&
          "border-2 border-indigo-400"
        }`}
    >
      <article
        className={`w-full h-auto flex flex-col items-start justify-start 
       overflow-visible space-y-1
        `}
      >
        <section className=" flex flex-row w-full text-[15px] font-semibold text-yt-white">
          <BookTitle
            bookdata={bookdata}
            currentUser={currentUser}
            sidebar={sidebar}
          />
          {bookdata.id && !readPage && (
            <BookmarkToggle
              bookdata={bookdata}
              currentUser={currentUser}
              sidebar
            />
          )}
        </section>
        <section className="text-sm font-normal">
          {bookdata.author}
          <span className="text-yt-white mx-2"> {bookdata.published}</span>
          {bookdata.publisher}{" "}
          <span className="text-yt-white mx-2">{bookdata.isbn}</span>
        </section>
      </article>
      {!readPage && (
        <aside className="w-full flex flex-row justify-between items-center mt-2 text-readine-green">
          <div className="w-auto">
            {bookdata.lines && bookdata.lines.length > 0 && (
              <BookReadInfo bookdata={bookdata} />
            )}
          </div>
          {currentUser && <CreateButton bookdata={bookdata} />}
        </aside>
      )}
    </section>
  );
};

export default BookCard;
