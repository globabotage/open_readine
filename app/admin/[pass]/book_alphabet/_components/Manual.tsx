"use client";

import { SafeBook } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ManualProps {
  book: SafeBook;
}

const Manual: React.FC<ManualProps> = ({ book }) => {
  const router = useRouter();

  const [updateBook, setUpdateBook] = useState<SafeBook>(book);

  useEffect(() => {
    setUpdateBook(book);
  }, [book]);

  const clickHandler = async () => {
    await axios.post("/api/admin/alphabet/manual", {
      book: updateBook,
    });
    router.refresh();
  };
  return (
    <div className="w-full h-full flex flex-col items-end space-y-2 p-1">
      <input
        type="text"
        className="bg-yt-atom text-yt-white px-2 text-sm rounded-sm"
        value={updateBook.titleAlphabet}
        onChange={(e) =>
          setUpdateBook({ ...updateBook, titleAlphabet: e.target.value })
        }
      />
      <button
        className="w-auto h-auto bg-sky-600 hover:bg-sky-300 text-yt-white py-1 px-3 rounded-md text-sm"
        onClick={clickHandler}
      >
        Change
      </button>
    </div>
  );
};

export default Manual;
