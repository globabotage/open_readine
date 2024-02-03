"use client";

import { SafeBook } from "@/types";
import { useRouter } from "next/navigation";

import { useCallback } from "react";
import { MdCreate } from "react-icons/md";
interface EditButtonProps {
  bookdata: SafeBook;
}

const CreateButton: React.FC<EditButtonProps> = ({ bookdata }) => {
  const router = useRouter();
  const gotoRead = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("book", JSON.stringify(bookdata));
      router.push("/read");
    }
  }, [bookdata, router]);

  return (
    <div className="w-fit px-2">
      <MdCreate size={22} style={{ cursor: "pointer" }} onClick={gotoRead} />
    </div>
  );
};

export default CreateButton;
