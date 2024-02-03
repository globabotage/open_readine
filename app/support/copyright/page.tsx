import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "不正投稿・機能への報告",
};

const CopyrightPage = () => {
  const title = "text-lg font-semibold text-green-300 mb-2 mt-2";

  return (
    <>
      <div className="w-full flex justify-center text-yt-white pt-3 pb-10">
        <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-3 text-sm ">
          <h1 className="text-lg text-center pb-5 font-semibold">
            著作権・不正投稿・機能上の不具合
          </h1>
          <h2 className={title}>著作権に関するお問い合わせ</h2>
          <div>
            本サイト（readine.jp）上で投稿されている内容が、書籍からの文書・図面等の抜粋に際して引用の範囲を超えた記述を含んでおり、著作権を侵害していると思われる場合、または他のインターネットサイトからの記事、イラスト、動画の転載が引用の範囲を超えており、著作権を侵害していると思われる場合は、本サイト内該当ページのリンクをご記載のうえ、
            <b className="text-readine-brown mx-1">support@readine.jp</b>
            までご報告下さい。
          </div>
          <div>
            著作権に関わる事項以外のお問い合わせにつきましては、ご返答は致しかねます。
          </div>
          <br />
          <div>
            Readine内で投稿される質問や回答の著作権、およびその使用許諾（ライセンス）については
            <Link
              href="/support/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-readine-green hover:text-yt-white mx-1"
            >
              <b>利用規約</b>
            </Link>
            の第10条をご確認下さい。
          </div>

          <h2 className={title}>その他の不正な投稿を報告する</h2>
          <div>
            本サイト（readine.jp）をご利用頂く中で、不正な投稿を発見された場合は、該当投稿があるページURLをご記載のうえ、
            <b className="text-readine-brown mx-1">support@readine.jp</b>
            までご報告下さい。ここでの「不正な投稿」とは違法の疑いがある投稿、または本サービスの利用規約に違反する投稿、あるいは特定個人、特定集団、特定アカウントへの中傷を含む投稿等を指します。
            運営者は頂いた報告内容を確認し、迅速に対応致します。なお、頂いたご報告に対して逐次のご返答は致しかねますのでご了承下さい。
          </div>

          <h2 className={title}>機能上の不具合を報告する</h2>
          <div>
            本サイト（readine.jp）をご利用頂く中で、機能上の不具合が生じた場合は、不具合が生じた際の状況等をご記載のうえ、
            <b className="text-readine-brown mx-1">support@readine.jp</b>
            までご報告下さい。機能改善についてのリクエストも承っております。なお、頂いたご報告に対して逐次のご返答は致しかねますのでご了承下さい。
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyrightPage;
