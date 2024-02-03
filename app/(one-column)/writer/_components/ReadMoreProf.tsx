"use client";
import useWriterModal from "@/hooks/writer/useWriterModal";
import { FiMoreHorizontal } from "react-icons/fi";

const ReadMoreProf = () => {
  const writerModal = useWriterModal();
  return (
    <div className="w-full flex flex-row justify-end -mt-5">
      <div
        className="w-16 h-6 flex justify-center items-center text-readine-green bg-yt-component/50 hover:bg-yt-atom rounded-2xl cursor-pointer shadow-md shadow-yt-component shadow-"
        onClick={() => {
          writerModal.onOpen();
        }}
      >
        <FiMoreHorizontal />
      </div>
    </div>
  );
};

export default ReadMoreProf;
