"use client";

import { RiAccountCircleFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useLoginModal from "@/hooks/modal/useLoginModal";
import useRegisterModal from "@/hooks/modal/useRegisterModal";
import { signOut } from "next-auth/react";
import { User } from "@prisma/client";
import Link from "next/link";
import { Inconsolata } from "next/font/google";
const inter = Inconsolata({ subsets: ["latin"] });

interface UserMenuProps {
  currentUser?: User | null;
  size?: number;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, size }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const LogOut = () => {
    signOut();
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  useEffect(() => {
    //他要素をクリックしたらメニューを閉じる
    //onBlurだけでは実現できない
    const handleClickOutside = (event: { target: any }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuRef]);

  const baseStyle = `p-2 hover:text-green-400  ${inter.className}`;

  return (
    <div className=" relative flex items-center overflow-visible ">
      <div
        ref={menuRef}
        onClick={toggleOpen}
        onBlur={toggleOpen}
        className=" w-auto   text-readine-green hover:text-yt-white"
      >
        <RiAccountCircleFill size={size} className=" cursor-auto" />
      </div>
      {isOpen && (
        <div className="absolute inline-block rounded-xl shadow-md w-[250px]  bg-yt-component text-yt-white bottom-16 right-0 md:bottom-auto md:top-16   text-sm border-zinc-400 border-2 ">
          <div className="flex flex-col cursor-pointer w-full pl-2 ">
            {currentUser ? (
              <>
                <Link
                  href={`/writer/${currentUser.id}`}
                  className={`${baseStyle}`}
                >
                  プロフィール
                </Link>
                <Link
                  href="/thanks"
                  className={`${inter.className} p-2 text-green-300 animate-pulse text-[17px]`}
                >
                  Thanks
                </Link>
                <Link href="/support/terms" className={`${baseStyle}`}>
                  利用規約
                </Link>
                <Link href="/support/privacy" className={`${baseStyle}`}>
                  プライバシーポリシー
                </Link>

                <Link href="/support/transaction" className={`${baseStyle}`}>
                  特定商取引法に基づく表記
                </Link>
                <div onClick={LogOut} className={`${baseStyle}`}>
                  ログアウト
                </div>
                <div
                  onClick={() => router.push("/support/delete")}
                  className="p-3 text-yt-text-gray hover:text-readine-green hover:font-semibold font-thin text-xs"
                >
                  退会
                </div>
              </>
            ) : (
              <>
                <div onClick={loginModal.onOpen} className={`${baseStyle}`}>
                  ログイン
                </div>
                <div onClick={registerModal.onOpen} className={`${baseStyle}`}>
                  新規登録
                </div>
                <Link href="/support/terms" className={`${baseStyle}`}>
                  利用規約
                </Link>
                <Link href="/support/privacy" className={`${baseStyle}`}>
                  プライバシーポリシー
                </Link>

                <Link href="/support/transaction" className={`${baseStyle}`}>
                  特定商取引法に基づく表記
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
