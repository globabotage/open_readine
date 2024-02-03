import { SafeThanks, SafeThanksRequest } from "@/types";
import { PiCurrencyDollarFill } from "react-icons/pi";
import HistoryCard from "./HistoryCard";

interface ThanksDashboardProps {
  thanks: SafeThanks[] | null;
  paymentRequests?: SafeThanksRequest[];
  payment?: boolean;
}

const ThanksDashboard: React.FC<ThanksDashboardProps> = ({
  thanks,
  paymentRequests,
  payment,
}) => {
  const thanksLength = thanks?.length || 0;
  const paymentRequestsLength = paymentRequests?.length || 0;

  const historyLength = thanksLength + paymentRequestsLength;
  return (
    <div className="w-full h-auto  text-yt-white flex flex-col items-center gap-3 px-1  pb-16">
      <div className="w-full h-atuo text-2xl font-bold pl-3 py-3 flex flex-row items-center justify-start space-x-2 bg-react-md-editor-dark border-b-2 border-b-black rounded-md shadow-lg">
        <PiCurrencyDollarFill
          size={25}
          className=" text-indigo-400 hover:text-yt-white "
        />
        <div className="text-green-500">
          {" "}
          Thanks {!payment ? "受取" : "支払"}履歴
        </div>
      </div>
      {!payment && (
        <div className="w-full text-right text-sm text-yt-text-gray my-1">
          入金の詳細については
          <a
            href="https://connect.stripe.com/express_login"
            className="underline text-green-200 mx-1"
            target="_blank"
          >
            Stripeダッシュボード
          </a>
          からご確認頂けます。
        </div>
      )}

      {paymentRequests &&
        paymentRequests.length > 0 &&
        paymentRequests?.map((item) => (
          <HistoryCard
            key={item.id}
            thanksRequest={item}
            payment={payment}
            isRequest
          />
        ))}
      {thanks &&
        thanks.length > 0 &&
        thanks?.map((item) => (
          <HistoryCard key={item.id} thanks={item} payment={payment} />
        ))}

      {historyLength === 0 && (
        <div className="w-full text-center text-yt-text-gray pt-5">
          履歴はありません。
        </div>
      )}
    </div>
  );
};

export default ThanksDashboard;
