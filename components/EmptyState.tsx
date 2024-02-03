"use client";

import { Interest } from "@prisma/client";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import InterestList from "./InterestList";

interface EmptyStateProps {
  linesList?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ linesList }) => {
  const pathname = usePathname();
  const [interestArray, setInterestArray] = useState<Interest[]>([]);
  useEffect(() => {
    //閉じているときに呼び出す
    axios
      .post(`/api/get/interests/random`, {
        num: 12,
      })
      .then((res) => setInterestArray(res.data));
  }, []);
  return (
    <>
      {pathname !== "/my_interests" && (
        <div className=" flex flex-col h-auto w-full items-center px-3 pt-3 overflow-y-auto text-yt-white text-lg">
          <div>
            {linesList
              ? "この本の行間はまだよまれていません。"
              : "🫢 行間が見つかりません。"}
          </div>
        </div>
      )}
      {pathname === "/my_interests" && (
        <div
          className={`flex flex-col items-center h-auto w-full text-indigo-300 
        ${linesList ? "mt-0 pb-5" : "mt-24"}
        `}
        >
          <div className="w-auto h-auto mb-5">
            {!linesList && <span>🫢&nbsp;</span>}関心が登録されていません。
          </div>

          {linesList && (
            <>
              <div className="text-sm text-yt-text-gray">
                👇登録してみましょう
              </div>
              <InterestList interestArray={interestArray} center />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default EmptyState;
