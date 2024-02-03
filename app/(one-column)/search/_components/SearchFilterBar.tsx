"use client";

import FilterLink from "@/components/FilterLink";

const SearchFilterBar = () => {
  return (
    <div className="flex flex-row justify-between mb-3 bg-black cursor-pointer shadow-md ">
      <FilterLink label="行間" center column={3} />
      <FilterLink label="本" column={3} />
      <FilterLink label="関心" column={3} />
    </div>
  );
};

export default SearchFilterBar;
