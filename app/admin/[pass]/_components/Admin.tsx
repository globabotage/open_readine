"use client";
import { useMemo, useState } from "react";
import qs from "query-string";
import Threads from "./Threads";
import HasItemIcon from "./HasItemIcon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Lines, Between } from "@prisma/client";

interface AdminProps {
  unCheckedLines: Lines[];
  unCheckedBetween: Between[];
  nonApprovedLines: Lines[];
  nonApprovedBetween: Between[];
  rejectedUsers: any[];
}

const Admin: React.FC<AdminProps> = ({
  unCheckedLines,
  unCheckedBetween,
  nonApprovedBetween,
  nonApprovedLines,
  rejectedUsers,
}) => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const adminPass = process.env.ADMIN_PASS;
  // const [mode, setQuery] = useState<"ucl" | "ucb" | "nal" | "nab" | "ru">("ucl");

  const setQuery = (mode: string) => {
    let currentQuery = {};
    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updateQuery: any = {
      ...currentQuery,
      mode: mode,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updateQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const mode = useMemo(() => {
    return params.get("mode") || "ucl";
  }, [params]);

  const tabClass = "px-2 py-2  rounded-md hover:bg-yt-atom cursor-pointer flex";
  return (
    <div className=" w-5/6 h-auto overflow-auto text-yt-white flex flex-col items-center relative ">
      <div className="w-5/6 h-14 pt-3 flex flex-row gap-2 items-center justify-between  sticky top-0 bg-black px-2 py-2 z-10">
        <div
          className={`${tabClass} ${
            mode === "ucl" ? "bg-yt-atom" : "bg-yt-component"
          }`}
          onClick={() => setQuery("ucl")}
        >
          unchecked lines
          <HasItemIcon length={unCheckedLines?.length} />
        </div>
        <div
          className={`${tabClass}
        ${mode === "ucb" ? "bg-yt-atom" : "bg-yt-component"}
        `}
          onClick={() => setQuery("ucb")}
        >
          unchecked btw
          <HasItemIcon length={unCheckedBetween?.length} />
        </div>
        <div
          className={`${tabClass}
          ${mode === "nal" ? "bg-yt-atom" : "bg-yt-component"}
        `}
          onClick={() => setQuery("nal")}
        >
          non approved lines
          <HasItemIcon length={nonApprovedLines?.length} />
        </div>
        <div
          className={`${tabClass}
        ${mode === "nab" ? "bg-yt-atom" : "bg-yt-component"}
        `}
          onClick={() => setQuery("nab")}
        >
          non approved btw
          <HasItemIcon length={nonApprovedBetween?.length} />
        </div>
        <div
          className={`${tabClass}
        ${mode === "ru" ? "bg-yt-atom" : "bg-yt-component"}
        `}
          onClick={() => setQuery("ru")}
        >
          rejected users
          <HasItemIcon length={rejectedUsers?.length} />
        </div>
      </div>
      <div className="w-3/4 h-auto ">
        {mode === "ucl" && <Threads LinesArray={unCheckedLines} />}
        {mode === "ucb" && <Threads BetweenArray={unCheckedBetween} />}
        {mode === "nal" && (
          <Threads LinesArray={nonApprovedLines} NonApproved />
        )}
        {mode === "nab" && (
          <Threads BetweenArray={nonApprovedBetween} NonApproved />
        )}
        {mode === "ru" && <Threads RejectedUsers={rejectedUsers} />}
      </div>
    </div>
  );
};

export default Admin;
