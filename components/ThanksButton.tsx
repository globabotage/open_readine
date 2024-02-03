"use client";

import useThanksModal from "@/hooks/modal/useThanksModal";
import { PiCurrencyDollarFill } from "react-icons/pi";
import ThanksModal from "./modals/ThanksModal";
import { User } from "@prisma/client";

interface ThanksButtonProps {
  destinationUser: User;
  loggedIn: boolean;
  label?: string;
  amount?: number;
}

const ThanksButton: React.FC<ThanksButtonProps> = ({
  destinationUser,
  loggedIn,
  label,
  amount,
}) => {
  const thanksModal = useThanksModal();

  return (
    <>
      {!label && (
        <div className="pr-3 flex flex-col items-center justify-end z-20">
          <div className="peer">
            <PiCurrencyDollarFill
              size={25}
              className=" text-green-500 cursor-pointer
              hover:text-green-300  hover:scale-125 transition-all duration-300 
            "
              onClick={() => thanksModal.onOpen()}
            />
          </div>

          <div className="hidden peer-hover:inline-block w-0 h-0 overflow-visible">
            <div className="block w-[100px] h-auto px-2 py-1 bg-indigo-500 rounded-r-md rounded-bl-md text-center text-sm ">
              Thanksで応援
            </div>
          </div>
        </div>
      )}
      {label && (
        <button
          className="flex items-center w-auto px-3 py-2 bg-yt-white hover:bg-green-200 text-black font-semibold rounded-xl "
          onClick={() => thanksModal.onOpen()}
        >
          <PiCurrencyDollarFill
            size={25}
            className=" text-green-500 cursor-pointer
              hover:text-green-300  hover:scale-125 transition-all duration-300 
            "
          />
          {label}
        </button>
      )}

      <ThanksModal
        destinationUser={destinationUser}
        loggedIn={loggedIn}
        requestedAmount={amount}
      />
    </>
  );
};

export default ThanksButton;
