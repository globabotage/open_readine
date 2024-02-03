"use client";

import useLoginModal from "@/hooks/modal/useLoginModal";

interface ReadMoreProps {
  sidebar?: boolean;
}
const ReadMore: React.FC<ReadMoreProps> = ({ sidebar }) => {
  const loginModal = useLoginModal();
  return (
    <div
      className={`flex justify-center w-full h-fit pt-40 bg-gradient-to-t ${
        sidebar ? "from-black" : "from-yt-bg"
      } ${
        sidebar ? "from-20%" : "from-30%"
      }   to-transparent to-70% -mt-48 z-30`}
    >
      <button
        className=" w-1/2 h-auto  py-5 mt-3 mb-5 rounded-full
            bg-gradient-to-r from-green-700/30 from-10%  to-indigo-700/30 to-90% hover:from-green-700/60 hover:to-indigo-700/60 text-center  text-yt-white  shadow-md shadow-green-300/30
            "
        onClick={loginModal.onOpen}
      >
        Read more
      </button>
    </div>
  );
};

export default ReadMore;
