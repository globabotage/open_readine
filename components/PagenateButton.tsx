"use client";
import useLoginModal from "@/hooks/modal/useLoginModal";
import { User } from "@prisma/client";
import Link from "next/link";

interface PagenateButtonProps {
  item: number;
  page: number;
  defaultPath: string;
  currentUser: User | null;
}
const PagenateButton: React.FC<PagenateButtonProps> = ({
  item,
  page,
  defaultPath,
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const className = ` w-6 h-6 rounded-sm text-sm text-center cursor-pointer  rounded-sm border-2 
 ${
   item === page
     ? "bg-green-200 text-yt-component font-semibold border-green-200 cursor-auto"
     : "bg-react-md-editor-dark hover:bg-yt-atom border-yt-component text-yt-white"
 }
`;
  return (
    <>
      {!currentUser && item > 3 ? (
        <div className={className} key={item} onClick={loginModal.onOpen}>
          {item}
        </div>
      ) : (
        <Link
          className={className}
          key={item}
          href={defaultPath + "?page=" + item}
        >
          {item}
        </Link>
      )}
    </>
  );
};

export default PagenateButton;
