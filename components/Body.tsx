"use client";
import { SafeBetween, SafeLines } from "@/types";
import Image from "next/image";
import EmptyState from "./EmptyState";
import Link from "next/link";
import LinesCardWrapper from "./Lines/LinesCardWrapper";
import { Interest, User } from "@prisma/client";
import BetweenList from "./Between/BetweenList";
import IconWrapper from "./IconWrapper";
import { useEffect, useRef } from "react";

interface BodyProps {
  lines: SafeLines;
  currentUser: User | null;
  interestArray: Interest[];
  page: number;
  defaultPath?: string;
}

const Body: React.FC<BodyProps> = ({
  lines,
  currentUser,
  interestArray,
  page,
  defaultPath,
}) => {
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.scrollTop = 0;
    }
  }, [lines]);
  return (
    <section
      className={`flex flex-col h-auto max-h-[93vh] w-full px-3 pt-5 pb-12 z-10 overflow-y-auto items-center md:w-3/4`}
      ref={myRef}
    >
      <article className={`w-full text-white  md:w-full lg:w-11/12`}>
        {lines && (
          <>
            <LinesCardWrapper
              lines={lines}
              interestArray={interestArray}
              currentUser={currentUser}
            />

            <BetweenList
              betweenArray={lines.betweens as SafeBetween[]}
              linesId={lines.id}
              currentUser={currentUser}
            />
          </>
        )}

        {!lines && <EmptyState />}
      </article>
      <div className="w-full fixed  bottom-12 left-3 md:hidden ">
        <Link
          className="w-fit h-fit founded-full"
          href={defaultPath ? defaultPath + "?page=" + page : "/"}
        >
          <IconWrapper logo diameter="h-14 w-14 select-none">
            <Image
              alt="Logo"
              className=" md:hidden cursor-auto"
              height="35"
              width="35"
              src="/images/logo_symbol_white.png"
            />
          </IconWrapper>{" "}
        </Link>
      </div>
    </section>
  );
};

export default Body;
