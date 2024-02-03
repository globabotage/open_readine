"use client";
import Button from "@/components/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BiLinkExternal } from "react-icons/bi";

interface StripeCreateAccountProps {
  accountId?: string;
  isStripePause: boolean;
}
const StripeCreateAccount: React.FC<StripeCreateAccountProps> = ({
  accountId,
  isStripePause,
}) => {
  const router = useRouter();

  const clickHandler = async () => {
    const res = await axios.post("/api/stripe/create", {
      accountId: accountId ? accountId : null,
    });
    if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      router.push("/thanks");
    }
  };
  return (
    <div className="group w-full h-auto flex flex-col items-end">
      {isStripePause && (
        <div className="hidden group-hover:flex w-3/4  overflow-visible  relative bg-white justify-end">
          <div className="px-3 py-2 rounded-t-md rounded-bl-md bg-rose-800 text-yt-white text-xs absolute z-20 bg-opacity-80 -top-4 -right-5">
            現在システムメンテナンス中です。
          </div>
        </div>
      )}
      <Button
        label={
          <div className="w-full flex flex-col items-center gap-1">
            <div className="text-white">受取申請をする</div>
            <div className="flex space-x-1 items-center">
              <div className="text-sm font-light ">
                Stripe登録フォームへ遷移します
              </div>
              <BiLinkExternal size={15} />
            </div>
          </div>
        }
        name="create"
        onClick={clickHandler}
        disabled={isStripePause}
      />
    </div>
  );
};

export default StripeCreateAccount;
