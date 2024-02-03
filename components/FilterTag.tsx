"use client";
import useWriterModal from "@/hooks/writer/useWriterModal";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface FilterTagProps {
  label: string;
  column: number;
  onClick: () => void;
  center?: boolean;
}
const FilterTag: React.FC<FilterTagProps> = ({
  label,
  column,
  onClick,
  center,
}) => {
  const params = useSearchParams();
  const writerModal = useWriterModal();
  const filter = params.get("filter");
  const isSelected = filter === label || (filter === null && label === "本");
  const basis = useMemo(() => {
    if (column === 2) {
      return "basis-1/2";
    } else if (column === 3) {
      return "basis-1/3";
    }
  }, [column]);

  return (
    <div
      className={`${basis} select-none cursor-pointer text-center py-3 hover:bg-yt-component w-auto h-auto 
        ${!writerModal.isOpen && "transform duration-200 "}
         ${isSelected ? "border-b-4 border-b-yt-white " : ""}
          ${center ? "border-x-2 border-x-yt-bg" : ""}
          // transformを指定すると要素がmodalを通り抜け前面に出てしまうので、isOpenの時だけtransformを無効にする
         
        `}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default FilterTag;
