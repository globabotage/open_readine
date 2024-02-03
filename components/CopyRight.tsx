"use client";

import Link from "next/link";

const CopyRight = () => {
  return (
    <footer
      className={`w-full h-auto text-center text-yt-text-gray text-xs px-2 py-1`}
    >
      不正な投稿や機能上の不具合のご報告は
      <Link
        className="inline underline cursor-pointer hover:text-yt-white"
        href="/support/copyright"
        target="_blank"
      >
        こちら
      </Link>
    </footer>
  );
};

export default CopyRight;
