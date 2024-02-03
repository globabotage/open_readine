"use client";

import useRegisterModal from "@/hooks/modal/useRegisterModal";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { MdFavorite } from "react-icons/md";

interface InterestIconProps {
  currentUser: User | null;
  size?: number;
}
const InterestIcon: React.FC<InterestIconProps> = ({ currentUser, size }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const clickHander = () => {
    if (currentUser) {
      router.push("/my_interests");
    } else {
      registerModal.onOpen();
    }
  };
  return (
    <div className="text-readine-green hover:text-white w-auto p-0 md:p-2 cursor-auto">
      <MdFavorite size={size} onClick={clickHander} />
    </div>
  );
};

export default InterestIcon;
