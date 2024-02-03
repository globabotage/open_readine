"use client";

import Modal from "./Modal";
import { usePathname, useRouter } from "next/navigation";
import useThanksModal from "@/hooks/modal/useThanksModal";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../Button";
import Link from "next/link";
import useLoginModal from "@/hooks/modal/useLoginModal";
import toast from "react-hot-toast";
import { SafeThanksRequest } from "@/types";
import dayjs from "dayjs";

interface ThanksModalProps {
  destinationUser: User;
  loggedIn: boolean;
  requestedAmount?: number;
}
const ThanksModal: React.FC<ThanksModalProps> = ({
  destinationUser,
  loggedIn,
  requestedAmount,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const thanksModal = useThanksModal();
  const loginModal = useLoginModal();

  const [amount, setAmount] = useState<number>(requestedAmount || 1000);
  const [sendRequest, setSendRequest] = useState<SafeThanksRequest | null>(
    null
  );

  const handleClose = () => {
    thanksModal.onClose();
    // router.push(pathname);
  };

  const createSession = async () => {
    const res = await axios.post(`/api/stripe/checkout`, {
      destinationUser: destinationUser,
      amount: amount,
      pathname: pathname,
    });

    if (res.data.url) {
      window.location.href = res.data.url;
    }
  };

  const storeRequest = async () => {
    const res = await axios.post("/api/thanks/request", {
      destinationUser: destinationUser,
      amount: amount,
    });
    toast.success("リクエストが送信されました！");
    handleClose();
  };

  useEffect(() => {
    const fetchState = async () => {
      const res = await axios.post("/api/thanks/request/state", {
        userId: destinationUser.id,
      });
      setSendRequest(res.data);
    };
    fetchState();
  }, [destinationUser.id]);

  let bodyContent;

  bodyContent = (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="w-full text-xl text-green-500 font-semibold text-center">
        Thanksで&nbsp;
        <span className="text-indigo-400">{destinationUser.name}</span>
        &nbsp;を応援する
      </div>
      <div className="h-1/2 w-full flex flex-row justify-center items-center text-xl">
        <select
          className="px-5 py-2 rounded-xl bg-yt-component text-yt-white cursor-pointer hover:bg-yt-atom "
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        >
          <option value="1000">1,000</option>
          <option value="1500">1,500</option>
          <option value="2000">2,000</option>
          <option value="3000">3,000</option>
          <option value="5000">5,000</option>
        </select>
        <span className="px-2 text-base text-yt-text-gray">円</span>
      </div>

      {destinationUser.stripeAccountId && loggedIn && (
        <div className="w-1/3 h-auto flex flex-col items-center gap-2">
          <Button label="支払う" onClick={createSession} outline />
          <div className="text-sm text-center text-yt-white">
            Stripeの決済フォームに移動します
          </div>
        </div>
      )}
      {destinationUser.stripeAccountId && !loggedIn && (
        <div className="w-2/3 h-auto flex flex-col items-center gap-2">
          <Button
            label="Log in"
            onClick={() => {
              loginModal.onOpen();
              handleClose();
            }}
            outline
          />
          <div></div>
        </div>
      )}

      {!destinationUser.stripeAccountId && (
        <div className="w-full md:w-3/4 h-auto flex flex-col items-center gap-3">
          <div className="text-center">
            このユーザーはまだThanksを受け取る準備ができていません。
          </div>{" "}
          <div className="text-center">リクエストを送ってみましょう！</div>
          {loggedIn && !sendRequest && (
            <>
              <Button
                label="Thanksリクエストを送る*"
                onClick={storeRequest}
                outline
              />
            </>
          )}
          {loggedIn && sendRequest && (
            <div className="w-full text-sm flex flex-col items-center">
              <button
                className="w-auto px-3 py-2 bg-green-400/30 rounded-xl
                cursor-not-allowed
              "
              >
                Thanksリクエスト送信済
                <span className="ml-1 text-center  text-yt-text-gray ">
                  {dayjs(sendRequest.createdAt).format("YYYY年M月D日")}
                </span>
              </button>
              <div></div>
            </div>
          )}
          {!loggedIn && (
            <div className="w-2/3 h-auto flex flex-col items-center gap-2">
              <Button
                label="Log in"
                onClick={() => {
                  loginModal.onOpen();
                  handleClose();
                }}
                outline
              />
              <div></div>
            </div>
          )}
          <div className="text-sm text-left text-yt-text-gray space-y-2 px-2">
            <div>
              *
              リクエストを送ることで、あなたがThanksを送りたい意思があることが、相手に通知されます。
            </div>
            <div>
              *このリクエストによって金銭の支払いが発生することは
              <u>ありません</u>。
              また、リクエスト先のユーザーがThanksを受け取る準備を完了したあとでも、あなたに
              <u>支払いの義務が生じるわけではありません。</u>
            </div>
          </div>
        </div>
      )}
      <Link
        href="/support/transaction"
        target="_blank"
        className="underline mt-12 mb-3 w-full text-center text-sm text-yt-text-gray hover:text-yt-white"
      >
        特定商取引法に基づく表記
      </Link>
    </div>
  );

  return (
    <Modal
      isOpen={thanksModal.isOpen}
      onClose={handleClose}
      onSubmit={() => {}}
      body={bodyContent}
      search
    />
  );
};

export default ThanksModal;
