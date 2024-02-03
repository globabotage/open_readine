"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";

import { BsSearch } from "react-icons/bs";
import qs from "query-string";
import useSearchModal from "@/hooks/modal/useSearchModal";

import { Roboto } from "next/font/google";
const inter = Roboto({
  subsets: ["latin"],
  weight: "100",
});

interface SearchBarProps {
  modal?: boolean;
  sizeIcon?: number;
}
const Searchbar: React.FC<SearchBarProps> = ({ modal, sizeIcon }) => {
  const router = useRouter();
  const params = useSearchParams();

  const searchModal = useSearchModal();

  const { isMedium } = useWindowSize();

  const [searchQuery, setSearchQuery] = useState("");

  const isSpaceOnly = (query: string) => {
    let regex = /^[\s　]*$/;
    return regex.test(query);
  };

  const handleClick = useCallback(() => {
    if (!isMedium && (!searchQuery || isSpaceOnly(searchQuery))) {
      return;
    }

    if (!modal && isMedium) {
      searchModal.onOpen();
      return;
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updateQuery: any = {
      ...currentQuery,
      query: searchQuery,
    };

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: updateQuery,
      },
      { skipNull: true }
    );
    router.push(url);

    if (modal) {
      searchModal.onClose();
    }
  }, [isMedium, searchQuery, modal, params, router, searchModal]);

  return (
    <div
      className={` h-auto rounded-full shadow-sm hover:shadow-md transition cursor-auto  flex justify-center items-center md:justify-end  pr-2 text-yt-white
      ${modal ? "w-full md:w-[340px]" : "w-auto md:w-1/2"}
      ${modal ? "py-2" : "py-0"}
      ${modal ? "pl-7 pr-2" : "pl-0 pr-0 md:pl-7 md:pr-2"}
      ${modal ? "border-2 border-yt-atom" : ""}
      ${
        modal
          ? "bg-yt-component hover:bg-yt-component/90"
          : "bg-none md:bg-yt-component md:hover:bg-yt-component/90"
      }
    
    `}
    >
      <input
        type="text"
        value={searchQuery}
        placeholder={`書籍名、著者名、キーワード`}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`peer w-11/12 h-full py-3  cursor-auto transition bg-transparent 
       outline-none placeholder:text-center md:placeholder:text-left
        ${modal ? "inline-block" : "hidden md:inline-block "}
        ${inter.className}

       `}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleClick();
          }
        }}
      />
      <button
        className={` flex justify-center items-center w-auto h-auto  rounded-full p-1.5 cursor-auto shadow-sm 
        ${
          modal
            ? "animate-bounce peer-focus:animate-none bg-gradient-to-r from-green-800/80 from-10%  to-indigo-600/80 to-90% hover:bg-zinc-500"
            : "bg-zinc-200 hover:bg-white md:bg-zinc-700 md:hover:bg-zinc-500"
        }
        ${modal ? "text-white" : "text-zinc-700 md:text-white"}
        
        `}
        onClick={handleClick}
      >
        <BsSearch
          size={sizeIcon}
          className={`
            ${modal ? "text-white" : "text-green-900 md:text-green-200"}
          `}
        />
      </button>
    </div>
  );
};

export default Searchbar;
