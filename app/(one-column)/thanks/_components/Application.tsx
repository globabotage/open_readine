"use client";
import StripeCreateAccount from "./StripeCreateAccount";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { PiCurrencyDollarFill } from "react-icons/pi";
import MaintenanceCard from "./MaintenanceCard";
import UrgingCard from "@/components/announce/UrgingCard";
import useWindowSize from "@/hooks/useWindowSize";
import { SafeThanksRequest } from "@/types";
import HistoryCard from "./HistoryCard";

interface ApplicationProps {
  currentUser: User | null;
  isStripePause: boolean;
  thanksRequests: SafeThanksRequest[];
}

const Application: React.FC<ApplicationProps> = ({
  currentUser,
  isStripePause,
  thanksRequests,
}) => {
  const { isMedium } = useWindowSize();
  const router = useRouter();
  if (!currentUser) {
    router.push("/");
  }
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <UrgingCard bgColor="bg-black" />
      {isStripePause && <MaintenanceCard />}
      <h1 className="text-xl font-semibold text-green-500 mt-5 mb-2 flex items-center">
        <PiCurrencyDollarFill
          size={25}
          className=" text-indigo-400 hover:text-yt-white cursor-pointer mr-2"
        />
        Thanks受取申請
      </h1>
      <div className="text-base text-green-100 px-5 md:px-0">
        Thanksは、投稿者が投稿に対する他のユーザーからの支援金です。
        {!isMedium && <br />}
        受取申請をすることで、支援金を受け取る準備が整います。
      </div>
      <div className="mt-3 w-5/6 md:w-1/2">
        <StripeCreateAccount isStripePause={isStripePause} />
      </div>
      <div className="w-5/6 h-auto mt-9 flex flex-col">
        {thanksRequests.length > 0 && (
          <>
            <div className="w-full text-center py-2 text-yt-white font-semibold">
              Thnaksのリクエストが届いています🎉
            </div>
            {thanksRequests.map((item) => (
              <HistoryCard key={item.id} thanksRequest={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Application;
