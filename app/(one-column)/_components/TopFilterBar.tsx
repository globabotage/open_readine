"use client";

import FilterLink from "@/components/FilterLink";

const TopFilterBar = () => {
  // const router = useRouter();
  // const params = useSearchParams();

  // const pathname = usePathname();

  // const clickHandler = useCallback(
  //   (filter: string) => {
  //     if (filter === "本") {
  //       router.push(pathname);
  //       return;
  //     }
  //     let currentQuery = {};

  //     if (params) {
  //       currentQuery = qs.parse(params.toString());
  //     }

  //     const updateQuery: any = {
  //       ...currentQuery,
  //       filter: filter,
  //     };

  //     const url = qs.stringifyUrl(
  //       {
  //         url: pathname,
  //         query: updateQuery,
  //       },
  //       { skipNull: true }
  //     );
  //     router.push(url);
  //   },
  //   [params, pathname, router]
  // );

  return (
    <div className="w-full h-auto flex flex-row justify-between mb-3 bg-black cursor-pointer shadow-md  ">
      {/* <FilterTag label="行間" onClick={() => clickHandler("行間")} column={2} />
      <FilterTag label="本" onClick={() => clickHandler("本")} column={2} /> */}
      <FilterLink label="行間" column={2} />
      <FilterLink label="本" column={2} />
      {/* FilterTag is more stable than FilterLink */}
    </div>
  );
};

export default TopFilterBar;
