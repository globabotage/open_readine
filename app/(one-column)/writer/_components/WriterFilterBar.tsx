"use client";

import FilterLink from "@/components/FilterLink";

const WriterFilterBar = () => {
  return (
    <div className="w-full h-auto flex flex-row justify-between mb-3 bg-black cursor-pointer shadow-md  ">
      <FilterLink label="行間" column={2} />
      <FilterLink label="本" column={2} />
    </div>
  );
};

export default WriterFilterBar;
