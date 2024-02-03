"use client";
import { Interest, User } from "@prisma/client";
import useInterest from "@/hooks/useInterest";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import Link from "next/link";
import useLoginModal from "@/hooks/modal/useLoginModal";

interface InterestCardProps {
  interest: Interest | null;
  sidebar?: boolean;
  currentUser?: User | null;
}

const InterestCard: React.FC<InterestCardProps> = ({
  interest,
  sidebar,
  currentUser,
}) => {
  const { onOpen } = useLoginModal();
  const { hasInterest, toggleInterest } = useInterest({
    interestId: interest?.id as string,
    currentUser: currentUser as User,
  });
  const baseStyle =
    "rounded-lg text-green-100 bg-gradient-to-t from-react-md-editor-dark from-5% to-black hover:from-indigo-500 hover:to-react-md-editor-dark cursor-pointer border-2 ";

  return (
    <>
      {!sidebar && (
        <Link
          className={`${baseStyle}  w-auto h-auto  ml-1 text-[13px] px-3 py-0.5 border-yt-atom text-center`}
          href={`/interest/${interest?.id}`}
        >
          {interest?.name}
        </Link>
      )}

      {sidebar && (
        <div className="w-full h-auto flex flex-row items-center justify-between mt-5">
          <div className="w-3/4 h-auto pb-3 flex flex-row justify-start pl-3">
            <h1
              className={`${baseStyle} w-fit h-fit  text-md px-5 py-1 
                ${
                  hasInterest
                    ? "shadow-md border-green-500 shadow-green-900 "
                    : "shadow-sm  border-yt-atom shadow-yt-atom"
                }`}
            >
              {interest?.name && interest?.name.length > 10
                ? interest?.name.slice(0, 10) + "…"
                : interest?.name}
            </h1>
          </div>
          {currentUser && (
            <div className="w-1/4 flex justify-center items-center">
              {!hasInterest ? (
                <AiFillPlusCircle
                  onClick={toggleInterest}
                  className="text-indigo-400/90 cursor-auto hover:text-indigo-200 hover:scale-110 transform duration-300"
                  size={30}
                />
              ) : (
                <AiFillMinusCircle
                  onClick={toggleInterest}
                  className="text-yt-atom cursor-auto hover:text-yt-atom-hover hover:scale-110 transform duration-300"
                  size={30}
                />
              )}
            </div>
          )}
          {!currentUser && (
            <div className="w-1/4 flex justify-center items-center">
              <AiFillPlusCircle
                onClick={onOpen}
                className="text-indigo-400/90 cursor-auto hover:text-indigo-200 hover:scale-110 transform duration-300"
                size={30}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InterestCard;
