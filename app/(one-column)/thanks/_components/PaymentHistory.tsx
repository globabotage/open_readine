import { SafeThanks } from "@/types";

import { PiCurrencyDollarFill } from "react-icons/pi";
import HistoryCard from "./HistoryCard";

interface PaymentHistoryProps {
  thanks: SafeThanks[] | null;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ thanks }) => {
  return (
    <div className="w-full h-auto max-h-screen text-yt-white flex flex-col items-center gap-3 px-1  pb-[150px]">
      <div className="w-full h-atuo text-2xl font-bold pl-3 py-3 flex flex-row items-center justify-start space-x-2 bg-react-md-editor-dark border-b-2 border-b-black rounded-md shadow-lg">
        <PiCurrencyDollarFill
          size={25}
          className=" text-indigo-400 hover:text-yt-white "
        />
        <div className="text-green-500"> Thanks 支払い履歴</div>
      </div>

      {thanks &&
        thanks.length > 0 &&
        thanks?.map((item) => <HistoryCard key={item.id} thanks={item} />)}
      {!thanks ||
        (thanks.length === 0 && (
          <div className="w-full text-center text-yt-text-gray pt-5">
            履歴はありません。
          </div>
        ))}
    </div>
  );
};

export default PaymentHistory;
