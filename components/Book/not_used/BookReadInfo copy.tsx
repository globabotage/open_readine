"use client";
import { SafeBook, SafeLines } from "@/types";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

interface BookReadInfoProps {
  bookdata: SafeBook;
}
const BookReadInfo: React.FC<BookReadInfoProps> = ({ bookdata }) => {
  const [book, setBook] = useState<SafeBook | null>(null);
  useEffect(() => {
    axios.post(`/api/get/book/${bookdata.id}`).then((res) => {
      setBook(res.data);
    });
  }, [bookdata.id]);

  const lines: SafeLines[] = useMemo(() => {
    return book?.lines || [];
  }, [book?.lines]);

  const readBetween = useMemo(() => {
    return lines.reduce((acc, line) => {
      if (line.betweens && line.betweens.length > 0) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [lines]);

  const unreadBetween = useMemo(() => {
    return lines.length - readBetween;
  }, [lines, readBetween]);

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
