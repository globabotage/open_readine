"use client";
import { StripeAccount } from "@/types";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiFillExclamationCircle } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import MaintenanceCard from "./MaintenanceCard";
import UrgingCard from "@/components/announce/UrgingCard";

interface ThanksHeaderProps {
  currentUser: User | null;
  account: StripeAccount | null;
  isStripePause: boolean;
}
const ThanksHeader: React.FC<ThanksHeaderProps> = ({
  currentUser,
  account,
  isStripePause,
}) => {
  const router = useRouter();
  if (!currentUser) {
    router.push("/");
  }

  const accountId = currentUser?.stripeAccountId;

  const enabled = account?.chargesEnabled && account?.payoutsEnabled;
  const editStripeAccount = async () => {
    const res = await axios.post(`/api/stripe/${accountId}`);
    if (res.data.url) {
      window.location.href = res.data.url;
    }
  };

  return (
    <div className="w-full flex flex-row justify-end mt-1 mb-1 text-white px-3">
      <div className="w-auto flex flex-col items-end justify-center z-10">
        <UrgingCard bgColor=" bg-gradient-to-r from-indigo-800 from-10% via-sky-800 via-30% to-emerald-800 to-90%" />
        {isStripePause && <MaintenanceCard />}

        <div
          className={`peer w-full flex flex-row items-center justify-end cursor-pointer 
          ${
            enabled && !isStripePause
              ? "text-readine-green hover:text-yt-white"
              : "text-rose-400 hover:text-rose-200"
          }`}
          onClick={!isStripePause ? editStripeAccount : () => {}}
        >
          <h1 className="text-sm flex flex-row items-center mt-0.5 mr-1">
            Thanks受取情報
            <BiLinkExternal />
          </h1>

          {(!enabled || isStripePause) && (
            <AiFillExclamationCircle className="ml-2" />
          )}
        </div>
        {!enabled || isStripePause ? (
          <div className="w-[200px] h-0 hidden peer-hover:inline-block text-yt-white   text-sm overflow-visible">
            <div className="w-full h-auto px-2 py-1 bg-yt-component rounded-xl ">
              {!enabled && !isStripePause && "未入力の情報があります。"}
              {isStripePause && "現在システムメンテナンス中です。"}
            </div>
          </div>
        ) : (
          <div className="w-fit h-0 hidden peer-hover:inline-block text-yt-white   text-sm overflow-visible">
            <div className="w-full h-auto px-2 py-1 bg-yt-component rounded-xl ">
              Stripeの外部リンクに移動します
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThanksHeader;
