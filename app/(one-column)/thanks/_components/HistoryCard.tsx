"use client";
import ThanksButton from "@/components/ThanksButton";
import { SafeThanks, SafeThanksRequest } from "@/types";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";

interface HistoryCardProps {
  thanks?: SafeThanks;
  thanksRequest?: SafeThanksRequest;
  payment?: boolean;
  isRequest?: boolean;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  thanks,
  thanksRequest,
  payment,
  isRequest,
}) => {
  const router = useRouter();
  const { thanksUserName, thanksUserId, requestUserName, requestUserId } =
    useMemo(() => {
      const thanksUserName = !payment
        ? thanks?.opponentUser?.name
        : thanks?.user?.name;
      const thanksUserId = !payment
        ? thanks?.opponentUser?.id
        : thanks?.user?.id;
      const requestUserName = !payment
        ? thanksRequest?.opponentUser?.name
        : thanksRequest?.user?.name;
      const requestUserId = !payment
        ? thanksRequest?.opponentUser?.id
        : thanksRequest?.user?.id;

      return {
        thanksUserName,
        thanksUserId,
        requestUserName,
        requestUserId,
      };
    }, [payment, thanks, thanksRequest]);

  const cancelHandler = async () => {
    await axios
      .post("/api/thanks/request/cancel", {
        thanksRequestId: thanksRequest?.id,
      })
      .then(() => {
        toast.success("リクエストを取り消しました！");
        router.refresh();
      })
      .catch(() => {
        toast.error("リクエストの取り消しに失敗しました。");
      });
  };

  return (
    <div
      className="w-full h-auto flex flex-col gap-2 k rounded-xl px-3 py-2
         bg-gradient-to-tr from-black from-10% to-black/90 to-90% shadow-md
        "
    >
      {payment && isRequest && (
        <div className="text-sm text-yt-white flex items-center ">
          <div className="w-auto px-2 py-0.5 mr-2 bg-yt-component text-yt-white rounded-md">
            リクエスト
          </div>

          <div className="text-yt-text-gray">※支払いは発生していません。</div>
        </div>
      )}
      <div className="w-full h-auto flex flex-row justify-between px-2 py-0.5 text-yt-text-gray">
        <div>
          <span className="text-[13px] pr-2">{!payment ? "From" : "To"}</span>
          <Link
            href={`writer/${thanks ? thanksUserId : requestUserId}`}
            className="text-indigo-400 hover:text-yt-white"
          >
            {thanks ? thanksUserName : requestUserName}
          </Link>
        </div>
        <div className="pl-2">
          {!payment && thanks && "入金予定額"}
          {!payment && thanksRequest && "リクエスト額"}
          {payment && thanks && "支払額"}
          {payment && isRequest && "支払リクエスト額"}
          &nbsp;
          <br className="md:hidden" />
          <span className="text-white px-2 font-semibold">
            {thanks?.amount || thanksRequest?.amount} 円
          </span>
        </div>
      </div>

      <div className="w-full h-auto text-right text-yt-text-gray text-sm">
        {dayjs(thanks?.createdAt).format("YYYY/MM/DD HH:mm")}
      </div>
      {payment && isRequest && (
        <div className="w-full h-auto py-0.5 flex justify-end">
          <div
            className="w-auto text-xs text-rose-600/90 hover:text-rose-400 cursor-pointer "
            onClick={cancelHandler}
          >
            リクエストを取り消す
          </div>
        </div>
      )}

      {payment && thanksRequest?.user.stripeAccountId && (
        <div className="bg-yt-component/50 px-2 py-3 rounded-lg text-sm text-yt-white flex flex-col items-center space-y-3">
          <div className="text-center">
            <span className="text-indigo-400 "> {requestUserName}</span>
            &nbsp;がThanksを受け取る準備を完了しました！Thanksを送ることができます。
          </div>
          <ThanksButton
            destinationUser={thanksRequest.user}
            loggedIn={true}
            label="Thanksを送る"
            amount={thanksRequest.amount}
          />
        </div>
      )}
    </div>
  );
};

export default HistoryCard;
