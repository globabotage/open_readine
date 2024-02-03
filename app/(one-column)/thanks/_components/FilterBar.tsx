"use client";

import Link from "next/link";

interface FilterBarProps {
  filter: string | null;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter }) => {
  const commonLinkStyle =
    "w-1/2 h-auto text-center text-yt-white text-sm font-semibold cursor-pointer  transition-colors duration-300 ease-in-out py-2 px-2 hover:bg-green-600";
  return (
    <div className="w-full md:w-2/3 lg:w-1/2 h-auto flex justify-center items-center mt-5 ">
      <Link
        href="/thanks"
        className={`${commonLinkStyle}
        ${filter === null ? "bg-green-700/80 " : "bg-yt-component"}
      `}
      >
        受取
      </Link>

      <Link
        href="/thanks?filter=payment"
        className={`${commonLinkStyle}
      ${filter === "payment" ? "bg-green-700/80 " : "bg-yt-component"}
      `}
      >
        支払
      </Link>
    </div>
  );
};

export default FilterBar;
