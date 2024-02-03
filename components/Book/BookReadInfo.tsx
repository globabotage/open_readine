import getBookById from "@/actions/Book/getBookById";
import { SafeBook, SafeLines } from "@/types";

interface BookReadInfoProps {
  bookdata: SafeBook;
}
const BookReadInfo: React.FC<BookReadInfoProps> = async ({ bookdata }) => {
  const book = await getBookById(bookdata.id as string);

  const readBetween = book?.lines?.reduce((acc, line) => {
    if (line.betweens && line.betweens.length > 0) {
      return acc + 1;
    }
    return acc;
  }, 0);

  let unreadBetween = 0;
  if (book?.lines?.length && readBetween) {
    unreadBetween = book.lines.length - readBetween;
  }

  return (
    <div className="w-full  text-right text-[13px]   font-semibold">
      {readBetween !== 0 && <span>よまれた行間&nbsp;{readBetween}件</span>}
      {readBetween !== 0 && unreadBetween !== 0 && (
        <span className="text-yt-text-gray/50 font-semibold">
          &nbsp;|&nbsp;
        </span>
      )}

      {unreadBetween !== 0 && <span>よみたい行間&nbsp;{unreadBetween}件</span>}
    </div>
  );
};

export default BookReadInfo;
