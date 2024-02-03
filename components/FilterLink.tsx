"use client";
import useWriterModal from "@/hooks/writer/useWriterModal";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FaBook } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

interface FilterTagProps {
  label: string | React.ReactElement;
  column: number;
  center?: boolean;
}
const FilterLink: React.FC<FilterTagProps> = ({ label, column, center }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const writerModal = useWriterModal();
  const filter = searchParams.get("filter");
  const query = searchParams.get("query");
  const isSelected = filter === label || (filter === null && label === "行間");
  const basis = useMemo(() => {
    if (column === 2) {
      return "basis-1/2";
    } else if (column === 3) {
      return "basis-1/3";
    }
  }, [column]);

  const path = useMemo(() => {
    if (pathname === "/search" && query) {
      return pathname + "/?filter=" + label + "&query=" + query;
    } else {
      if (label === "行間") {
        return pathname;
      } else {
        return pathname + "/?filter=" + label;
      }
    }
  }, [pathname, query, label]);

  return (
    <Link
      className={`${basis} select-none  text-center py-3 hover:bg-yt-component w-auto h-auto  flex justify-center items-center text-yt-white
        ${!writerModal.isOpen && "transform duration-200 "}
         ${isSelected ? "border-b-4 border-b-yt-white " : ""}
          ${center ? "border-x-2 border-x-yt-bg" : ""}
          // transformを指定すると要素がmodalを通り抜け前面に出てしまうので、isOpenの時だけtransformを無効にする
         
        `}
      href={path}
    >
      {label === "行間" && (
        <Image
          alt="Logo"
          height={30}
          width={30}
          className="pr-1 opacity-60"
          src="/images/icon-readine-green.png"
          priority // 画像の読み込みを優先
        />
      )}

      {label === "本" && (
        <FaBook className="pr-2 text-readine-green/60" size={20} />
      )}
      {label === "関心" && (
        <MdFavorite className="pr-2 text-readine-green/60" size={25} />
      )}

      {label}
    </Link>
  );
};

export default FilterLink;
