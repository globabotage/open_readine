"use client";
import { SafeBetween } from "@/types";

import Button from "../Button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useToggleEditor from "@/hooks/useToggleEditor";
import { User } from "@prisma/client";
import useRegisterModal from "@/hooks/modal/useRegisterModal";
import { useRouter } from "next/navigation";
import useMobileSidebar from "@/hooks/useSidebar";
import BetweenCard from "./BetweenCard";

export interface BetweenEditorState {
  id: string | number;
  isOpen: boolean;
}

interface BetweenListProps {
  betweenArray: SafeBetween[] | null;
  linesId: string;
  currentUser: User | null;
}

const BetweenList: React.FC<BetweenListProps> = ({
  betweenArray,
  linesId,
  currentUser,
}) => {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const registerModal = useRegisterModal();
  const { isOpenLinesEditor, setBetweenOpen } = useToggleEditor();
  //直接betwennEditorとして呼び出すとuseEffect内で使用できない。

  const mobileSidebar = useMobileSidebar();
  const [betweenEditorState, setBetweenEditorState] = useState<
    BetweenEditorState[]
  >([] as BetweenEditorState[]);

  const hasOpen = useMemo(() => {
    return betweenEditorState.some((state) => state.isOpen);
  }, [betweenEditorState]);

  useEffect(() => {
    const existingBetweenState = betweenArray?.map((between) => ({
      id: between.id,
      isOpen: false,
    })) as BetweenEditorState[];

    setBetweenEditorState([...existingBetweenState, { id: -1, isOpen: false }]);
  }, [betweenArray]);

  useEffect(() => {
    setBetweenOpen(hasOpen);
  }, [hasOpen, setBetweenOpen]);

  const onOpen = useCallback(() => {
    if (!currentUser) {
      registerModal.onOpen();
      return;
    }

    setIsEditorOpen(true);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setBetweenEditorState?.((prev) =>
      prev.map((state) =>
        state.id === -1 ? { ...state, isOpen: true } : state
      )
    );
  }, [currentUser, registerModal]);

  useEffect(() => {
    if (betweenEditorState.some((state) => state.id === -1 && !state.isOpen)) {
      setIsEditorOpen(false);
    }
  }, [betweenEditorState, router]);

  useEffect(() => {
    //Access MathJax globally and reprocess mathematical expressions
    //I put this on LinesList.tsx at once, but it didn't work on mac.
    setTimeout(() => {
      (window as any).MathJax?.typesetPromise?.();
    }, 300); //if not wait, MathJax is not defined
    //Dependencies inclueds sidebar state for moblie device.If not, it doesn't work.
  }, [betweenArray, mobileSidebar.isOpen]); //

  return (
    <section className="mt-3">
      {!isOpenLinesEditor &&
        (betweenArray === null || betweenArray.length === 0) && (
          <div>まだこの行間はよまれていません。</div>
        )}
      {betweenArray !== null &&
        betweenArray?.map((between) => (
          <BetweenCard
            key={between.id}
            between={between}
            currentUser={currentUser}
            setBetweenEditorState={setBetweenEditorState}
          />
        ))}
      <div className="flex justify-end py-2 ">
        {!isEditorOpen && !isOpenLinesEditor && (
          <div className="w-1/2 md:w-1/4 h-auto min-w-[120px]">
            <Button label="この行間をさらによむ" onClick={onOpen} small />
          </div>
        )}
      </div>
      {isEditorOpen && (
        <BetweenCard
          linesId={linesId}
          setBetweenEditorState={setBetweenEditorState}
        />
      )}
      <div ref={bottomRef} />
    </section>
  );
};

export default BetweenList;
