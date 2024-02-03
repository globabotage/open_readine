"use client";

import useRegisterModal from "@/hooks/modal/useRegisterModal";
import { SafeBook } from "@/types";
import { User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { BiSolidBookAlt } from "react-icons/bi";
interface BookTitleProps {
  bookdata: SafeBook;
  currentUser?: User | null;
  sidebar?: boolean;
}

const BookTitle: React.FC<BookTitleProps> = ({
  bookdata,
  currentUser,
  sidebar,
}) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const pathname = usePathname();

  const handleClick = useCallback(() => {
    if (!bookdata.lines) {
      if (!currentUser) {
        registerModal.onOpen();
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("book", JSON.stringify(bookdata));
      }

      router.push("/read");
      return;
    }
    router.push(`/book/${bookdata.id}`);
  }, [bookdata, currentUser, registerModal, router]);

  return (
    <section
      className={`cursor-pointer text-green-200 hover:text-green-400 ${
        sidebar || pathname.includes("bookmark") ? "basis-5/6" : "w-full "
      }`}
      onClick={handleClick}
    >
      <BiSolidBookAlt size={16} className="inline" />
      <h2 className="inline select-none"> {bookdata.title}</h2>
    </section>
  );
};

export default BookTitle;
