"use client";

import useRegisterModal from "@/hooks/modal/useRegisterModal";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { BsFillBookmarksFill } from "react-icons/bs";

interface BookmarkIconProps {
  currentUser: User | null;
  size?: number;
}
const BookmarkIcon: React.FC<BookmarkIconProps> = ({ currentUser, size }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const clickHander = () => {
    if (currentUser) {
      router.push("/bookmark");
    } else {
      registerModal.onOpen();
    }
  };
  return (
    <div className="text-readine-green hover:text-white w-auto p-0 md:p-2 cursor-auto">
      <BsFillBookmarksFill size={size} onClick={clickHander} />
    </div>
  );
};

export default BookmarkIcon;
