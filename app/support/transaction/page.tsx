import getCurrentUser from "@/actions/getCurrentUser";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
};

const TransactionPage = async () => {
  const currentUser = await getCurrentUser();

  const tableClass = "w-full sm:w-11/12   text-sm sm:text-base ";
  const trClass = "";
  const thClass =
    "w-1/4 text-left text-white font-bold bg-black pl-2 border-2  border-yt-atom";
  const tdClass =
    "w-3/4 text-left text-yt-white pl-2 py-2 border-2 border-yt-atom";

  return (
    <article className="w-full flex flex-row justify-center">
      <div className="basis-full sm:basis-2/3 flex flex-col items-center space-y-2  mb-5">
        <div>
          <h1 className="title-red-2 text-center mt-4 text-green-300 font-semibold text-xl ">
            Readine 特定商取引法に基づく表記
          </h1>
        </div>

        <table className={tableClass}>
          <tbody>
            {currentUser && (
              <tr className={trClass}>
                <th className={thClass}>販売事業者・運営責任者</th>
                <td className={tdClass}>日野譲登</td>
              </tr>
            )}

            <tr className={trClass}>
              <th className={thClass}>所在地</th>
              <td className={tdClass}>
                〒600-8223&nnbsp;京都府京都市下京区七条通油小路東入大黒町227番地
                第2キョートビル402
              </td>
            </tr>
            <tr className={trClass}>
              <th className={thClass}>Email</th>
              <td className={tdClass}>support@readine.jp</td>
            </tr>
            {/* <tr className={trClass}>
            <th className={thClass}>電話番号</th>
            <td className={tdClass}></td>
          </tr> */}
            {/* <tr className={trClass}>
            <th className={thClass}>電話受付時間</th>
            <td className={tdClass}></td>
          </tr> */}

            <tr className={trClass}>
              <th className={thClass}>販売価格</th>
              <td className={tdClass}>
                <div>
                  <p>
                    <span className="text-green-200 ">
                      Thanks機能を利用した支払:
                    </span>
                    &emsp; 決済時に表示される金額（税込）
                  </p>

                  <p>
                    <span className="text-green-200 ">
                      Thanks機能によって支払われた金額の受取:
                    </span>
                    &emsp;
                    <Link href="/terms" target="_blank" className="underline">
                      利用規約
                    </Link>
                    に定める手数料{" "}
                  </p>
                </div>
              </td>
            </tr>
            <tr className={trClass}>
              <th className={thClass}>支払方法</th>
              <td className={tdClass}>
                クレジットカード決済（VISA，MASTER，JCB, AMEX, Diners
                Club）をご利用いただけます。
              </td>
            </tr>
            <tr className={trClass}>
              <th className={thClass}>支払期限</th>
              <td className={tdClass}>
                クレジットカード決済画面におけるクレジットカード情報の送信完了時に決済させていただきます。なおご請求日は各カード会社により異なります。
              </td>
            </tr>
            <tr className={trClass}>
              <th className={thClass}>キャンセル・払戻し</th>
              <td className={tdClass}>
                決済完了後は、いかなる理由に拘わらず、その内容の変更、キャンセル、払戻しはお受けしておりません。
              </td>
            </tr>
            <tr className={trClass}>
              <th className={thClass}>その他</th>
              <td className={tdClass}>
                表示を省略した事項については、お客様からの開示の請求があった場合は、
                法律の定めに従って遅滞なく開示するものとします。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default TransactionPage;
