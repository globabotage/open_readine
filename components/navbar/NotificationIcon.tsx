"use client";

import useWindowSize from "@/hooks/useWindowSize";
import { SafeThanks, SafeThanksRequest } from "@/types";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoNotificationsSharp } from "react-icons/io5";

import { Inconsolata } from "next/font/google";
const inter = Inconsolata({ subsets: ["latin"] });
//subsets reduces the size of the font file and improves performance
interface NotificationIconProps {
  thanks?: SafeThanks[] | null;
  thanksRequests?: SafeThanksRequest[];
  paymentRequests?: SafeThanksRequest[];
  size?: number;
}
const NotificationIcon: React.FC<NotificationIconProps> = ({
  thanks,
  thanksRequests,
  paymentRequests,
  size,
}) => {
  const [iconClicked, setIconClicked] = useState(false);
  const { isMedium } = useWindowSize();

  const [notificationLength, setNotificationLength] = useState(0);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const clickThanks = async (id: string) => {
    const res = await axios.post(`/api/thanks/read`);
    setIconClicked(false);
    router.push("/thanks");
    router.refresh();
  };

  const clickThanksRequest = async (id: string) => {
    const res = await axios.post(`/api/thanks/request/read`, {
      userType: "receiver",
    });
    setIconClicked(false);
    router.push("/thanks");
    router.refresh();
  };
  const clickPaymentRequest = async (id: string) => {
    const res = await axios.post(`/api/thanks/request/read`, {
      userType: "sender",
    });
    setIconClicked(false);
    router.push("/thanks?filter=payment");
    router.refresh();
  };

  useEffect(() => {
    setNotificationLength(
      (thanks?.filter((item) => !item.isRead)?.length || 0) +
        (thanksRequests?.filter((item) => !item.isUserRead)?.length || 0) +
        (paymentRequests?.filter(
          (item) => !item.isOpponentRead && item.user.stripeAccountId
        )?.length || 0)
    );
  }, [paymentRequests, thanks, thanksRequests]);

  useEffect(() => {
    //Close the menu after clicking on another element.
    //onBlurだけでは実現できない
    const handleClickOutside = (event: { target: any }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIconClicked(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="w-auto h-auto flex flex-col items-center ">
      <div
        ref={menuRef}
        className={`text-readine-green hover:text-white w-auto p-0 md:p-2 cursor-auto relative`}
      >
        <IoNotificationsSharp
          size={size}
          onClick={() => setIconClicked(!iconClicked)}
        />
        {notificationLength > 0 && (
          <span className="absolute block rounded-full  bg-green-500 ring-2 ring-white top-2 right-2 h-2 w-2 md:h-3 md:w-3" />
        )}
      </div>

      <div className="w-0 h-0 overflow-visible relative ">
        {iconClicked && (
          <div
            className={` absolute  w-[300px] h-auto px-3 py-2 flex flex-col gap-2 items-center bg-yt-atom text-yt-white rounded-xl border-2 border-yt-white
          ${isMedium ? "-right-20 bottom-12" : "right-0 "}
          ${inter.className}
          `}
          >
            {notificationLength === 0 && (
              <div className="text-sm text-yt-white">通知はありません</div>
            )}
            {notificationLength > 0 &&
              thanksRequests?.map(
                (item) =>
                  !item.isUserRead && (
                    <div
                      key={item.id}
                      className="flex flex-col items-end justify-start  bg-black px-3 py-3 rounded-xl cursor-pointer hover:bg-black/80 hover:shadow-md"
                      onClick={() => {
                        clickThanksRequest(item.id);
                      }}
                    >
                      <div className="text-sm ">
                        <span className="font-semibold text-indigo-400 mr-1 ">
                          {item.opponentUser?.name}
                        </span>
                        から
                        <span className="text-red-200 mx-1">
                          Thanks&nbsp;Request
                        </span>
                        &nbsp;が送られました🎉
                      </div>
                      <div className="text-xs text-yt-text-gray">
                        {dayjs(item.createdAt).format("M/D h:m")}
                      </div>
                    </div>
                  )
              )}
            {notificationLength > 0 &&
              paymentRequests?.map(
                (item) =>
                  item.user.stripeAccountId && (
                    <div
                      key={item.id}
                      className="flex flex-col items-end justify-start  bg-black px-3 py-3 rounded-xl cursor-pointer hover:bg-black/80 hover:shadow-md"
                      onClick={() => {
                        clickPaymentRequest(item.id);
                      }}
                    >
                      <div className="text-sm ">
                        あなたが支払いリクエストを送った
                        <span className="font-semibold text-indigo-400 mr-1 ">
                          {item.user?.name}
                        </span>
                        さんが、支払いの受取準備を完了しました。
                      </div>
                      <div className="text-xs text-yt-text-gray">
                        {dayjs(item.createdAt).format("M/D h:m")}
                      </div>
                    </div>
                  )
              )}
            {notificationLength > 0 &&
              thanks?.map(
                (item) =>
                  !item.isRead && (
                    <div
                      key={item.id}
                      className="flex flex-col items-end justify-start  bg-black px-3 py-3 rounded-xl cursor-pointer hover:bg-black/80 hover:shadow-md"
                      onClick={() => {
                        clickThanks(item.id);
                      }}
                    >
                      <div className="text-sm ">
                        <span className="font-semibold text-indigo-400 mr-1">
                          {item.opponentUser?.name}
                        </span>
                        から<span className="text-green-200 mx-1">Thanks</span>
                        &nbsp;が送られました🎉
                      </div>
                      <div className="text-xs text-yt-text-gray">
                        {dayjs(item.createdAt).format("M/D h:m")}
                      </div>
                    </div>
                  )
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationIcon;
