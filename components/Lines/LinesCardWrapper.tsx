"use client";

import useToggleEditor from "@/hooks/useToggleEditor";
import LinesCard from "./LinesCard";
import BookmarkToggle from "./BookmarkToggle";
import LinesEditor from "./LinesEditor";
import { SafeLines } from "@/types";
import { Interest, User } from "@prisma/client";

interface LinesCardWrapperProps {
  lines: SafeLines;
  interestArray: Interest[];
  currentUser: User | null;
}
const LinesCardWrapper: React.FC<LinesCardWrapperProps> = ({
  lines,
  interestArray,
  currentUser,
}) => {
  const { isOpenLinesEditor } = useToggleEditor();
  return (
    <>
      {!isOpenLinesEditor && (
        <LinesCard
          lines={lines}
          interestArray={interestArray}
          currentUser={currentUser}
        >
          <BookmarkToggle lines={lines} currentUser={currentUser} />
        </LinesCard>
      )}

      {isOpenLinesEditor && (
        <LinesEditor lines={lines} interestArray={interestArray} />
      )}
    </>
  );
};

export default LinesCardWrapper;
