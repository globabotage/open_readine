"use client";
import { SafeLines } from "@/types";

import { Interest } from "@prisma/client";
import LinesCard from "./LinesCard";
import EmptyState from "../EmptyState";
import UrgingCard from "../announce/UrgingCard";
import { useEffect, useRef } from "react";
import CopyRight from "../CopyRight";

interface LinesListProps {
  linesArray: SafeLines[] | null;
  linesId?: string;
  interestArray?: Interest[];
  defaultPath?: string;
  page?: number;
  mobile?: boolean;
  sidebar?: boolean;
}

const LinesList: React.FC<LinesListProps> = ({
  linesArray,
  interestArray,
  defaultPath,
  linesId,
  page,
  mobile,
  sidebar,
}) => {
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This will run after the component has been rendered
    if (myRef.current) {
      myRef.current.scrollTop = 0;
    }
  }, [page]);
  return (
    <>
      <div
        className={`w-full h-auto ${sidebar && "overflow-y-auto"}`}
        ref={myRef}
      >
        {linesArray &&
          linesArray.length > 0 &&
          linesArray.map((lines, index) => (
            <LinesCard
              key={index}
              lines={lines}
              interestArray={interestArray}
              defaultPath={defaultPath}
              isListed
              isSelected={linesId === lines.id}
              isFirst={index === 0 && !linesId}
              page={page}
            />
          ))}

        {!linesArray ||
          (linesArray?.length === 0 && (
            <>
              {" "}
              <EmptyState linesList />
              {!defaultPath?.includes("my_interests") && (
                <UrgingCard bgColor=" bg-gradient-to-r from-indigo-900 from-10% via-sky-900 via-30% to-emerald-900 to-90%" />
              )}
            </>
          ))}
        {mobile && <CopyRight />}
      </div>

      {!mobile && <CopyRight />}
    </>
  );
};

export default LinesList;
