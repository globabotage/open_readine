"use client";

import useMyInterestsModal from "@/hooks/modal/useMyInterestsModal";

import { User } from "@prisma/client";
import { MdCreate } from "react-icons/md";

interface MyInterestsCardProps {
  currentUser?: User | null;
}

const MyInterestsCard: React.FC<MyInterestsCardProps> = ({ currentUser }) => {
  const myInterestsModal = useMyInterestsModal();

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-center text-yt-white">
        <div className="mt-3 pb-3 text-lg  flex flex-row items-center space-x-2 text-readine-green">
          <h1>
            <span className="text-indigo-400 mr-2">{currentUser?.name}</span>
            の関心
          </h1>

          <MdCreate
            className="hover:text-yt-white cursor-pointer "
            size={20}
            onClick={() => myInterestsModal.onOpen()}
          />
        </div>
      </div>
    </>
  );
};

export default MyInterestsCard;
