"use client";
import Logo from "./Logo";
import useSearchModal from "@/hooks/modal/useSearchModal";

const LogoMessage = () => {
  const { onClose } = useSearchModal();
  return (
    <div
      className="cursor-auto w-full flex flex-col items-center rounded-full "
      onClick={onClose}
    >
      <Logo modal />
      <div
        className={`text-lg mt-1 mb-3 text-yt-white select-none 
    
      `}
      >
        The place just to read between the lines.
      </div>
    </div>
  );
};

export default LogoMessage;
