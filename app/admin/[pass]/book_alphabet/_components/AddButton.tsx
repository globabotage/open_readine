"use client";

import { SafeBook } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AddButtonProps {
  book: SafeBook;
}

const AddButton: React.FC<AddButtonProps> = ({ book }) => {
  const router = useRouter();

  const clickHandler = async () => {
    await axios.post("/api/admin/alphabet", {
      book,
    });
    router.refresh();
  };
  return (
    <button
      className="w-auto h-auto bg-sky-600 hover:bg-sky-300 text-yt-white py-1 px-3 rounded-md text-sm"
      onClick={clickHandler}
    >
      Generate
    </button>
  );
};

export default AddButton;
