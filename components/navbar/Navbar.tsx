"use client";
import Logo from "../Logo";
import UserMenu from "./UserMenu";
import Searchbar from "../Searcbar";

import InterestIcon from "./InterestIcon";
import BookmarkIcon from "./BookmarkIcon";
import NotificationIcon from "./NotificationIcon";
import { usePathname, useSearchParams } from "next/navigation";
import useMobileSidebar from "@/hooks/useSidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import useToggleEditor from "@/hooks/useToggleEditor";
import { User } from "@prisma/client";

import { signOut, useSession } from "next-auth/react";

import { SafeThanks, SafeThanksRequest } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import useToggleNavbar from "@/hooks/useToggleNavbar";
import useZoomImageModal from "@/hooks/modal/useZoomImageModal";

interface NavbarProps {
  currentUser?: User | null;
  thanks?: SafeThanks[] | null;
  thanksRequests?: SafeThanksRequest[];
  paymentRequests?: SafeThanksRequest[];
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  thanks,
  thanksRequests,
  paymentRequests,
}) => {
  const pathName = usePathname();
  const mobileSidebar = useMobileSidebar();
  const searchParams = useSearchParams();
  const { isOpenNavbar, setIsOpenNavbar } = useToggleNavbar();
  const zoomImageModal = useZoomImageModal();
  const error = searchParams.get("error");

  const {
    isOpenLinesEditor,
    hasOpenBetweenEditor,
    setLinesOpen,
    setBetweenOpen,
  } = useToggleEditor();
  const { isMedium } = useWindowSize();
  const isRead = pathName === "/read";
  const isTwoColumn =
    pathName.includes("book") || pathName.includes("interest");

  useEffect(() => {
    setIsOpenNavbar(
      !isRead &&
        !(!isMedium && zoomImageModal.isOpen) &&
        !(isTwoColumn && isMedium && !mobileSidebar.isOpen)
    );
    // setIsOpenNavbar(
    //   !isRead &&
    //     !(isTwoColumn && isMedium && !mobileSidebar.isOpen) &&
    //     !isOpenLinesEditor &&
    //     !hasOpenBetweenEditor
    // );
  }, [
    isRead,
    isTwoColumn,
    isMedium,
    mobileSidebar.isOpen,
    isOpenLinesEditor,
    hasOpenBetweenEditor,
    setIsOpenNavbar,
    zoomImageModal.isOpen,
  ]);

  useEffect(() => {
    const handlePopstate = (event: PopStateEvent) => {
      if (isRead || isOpenLinesEditor || hasOpenBetweenEditor) {
        if (isOpenLinesEditor) {
          setLinesOpen(false);
        }
        if (hasOpenBetweenEditor) {
          setBetweenOpen(false);
        }
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [
    hasOpenBetweenEditor,
    isOpenLinesEditor,
    isRead,
    setBetweenOpen,
    setLinesOpen,
  ]);

  const [isFirst, setIsFirst] = useState(true);

  const session = useSession();
  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
      return;
    }
    if (error === "OAuthAccountNotLinked") {
      toast.error(
        "このメールアドレスは他のアカウントで使用されている可能性があります。"
      );
      return;
      //If the same email as the provider an user logs in  with is already being used by an email registered user, the message of duplication should be displayed.
    }

    const checkExpiry = async () => {
      if (session.data?.user?.email) {
        await axios.post("/api/auth/check_expiry").then((res) => {
          if (res.data === "ban") {
            toast.error("このアカウントは使用できません");
            setTimeout(() => {
              signOut();
            }, 1000);
          }
        });
      }
    };
    checkExpiry();

    const checkNameDuplicated = async () => {
      //If the name given automatically by the provider at the first login is duplicated, the name should be changed.
      if (session.data?.user?.name) {
        await axios.post(`/api/auth/check_duplication`, {
          type: "provider",
          value: session.data.user.name,
          providerEmail: session.data.user.email,
        });
      }
    };
    checkNameDuplicated();
  }, [error, isFirst, session?.data?.user?.email, session?.data?.user?.name]);

  return (
    <header>
      {isOpenNavbar && (
        <nav>
          <div className="md:fixed top-0 left-0  w-full h-auto font-mono text-sm md:flex md:items-center md:justify-between bg-black relative z-30">
            <div className="hidden md:inline-block md:static md:w-auto  md:rounded-xl  md:justify-center  p-2 md:p-3 ">
              <Logo />
            </div>
            <div
              className={`fixed bottom-0 left-0 flex justify-between items-center w-full  md:static h-auto md:w-2/3  bg-black 
            ${isMedium ? "p-2" : "p-3"}
            `}
            >
              <Searchbar sizeIcon={isMedium ? 14 : 18} />
              <InterestIcon
                currentUser={currentUser as User}
                size={isMedium ? 25 : 30}
              />
              <BookmarkIcon
                currentUser={currentUser as User}
                size={isMedium ? 25 : 30}
              />
              {currentUser && (
                <NotificationIcon
                  thanks={thanks}
                  thanksRequests={thanksRequests}
                  paymentRequests={paymentRequests}
                  size={isMedium ? 25 : 30}
                />
              )}
              <UserMenu currentUser={currentUser} size={isMedium ? 25 : 35} />
            </div>
          </div>
          <div className="hidden md:inline-block w-full h-16 " />
          {/* Navbarがfixedのため、Bodyの上に空白を作る */}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
