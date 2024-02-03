import Delete from "./components/Delete";
import getCurrentUser from "@/actions/getCurrentUser";

const DeletePage = async () => {
  const strong = "font-semibold text-rose-400";
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full h-auto flex flex-col items-center gap-1 text-yt-white px-3 ">
      <h1 className="text-lg">アカウントの削除</h1>

      <div className="text-yt-text-gray py-5">
        アカウントを削除する前に、以下の注意事項をご確認下さい。
      </div>

      <ol className="w-full sm:w-1/2 list-disc space-y-3 mb-5">
        <li>
          アカウントを一度削除すると、
          <span className={strong}>その操作を元に戻すことは出来ません。</span>
        </li>

        <li>
          アカウントを削除してから30日間は、現在のアカウントに使用されているメールアドレスを使用して再度会員登録を行うことができません。
        </li>

        <li>
          投稿された質問や回答は、アカウントとの関連付けが解消されますが
          <span className={strong}>引き続きサイトに表示されます。</span>
          作成者名は<span className={strong}>Readine</span>
          と表示され匿名化されます。
        </li>
      </ol>
      <Delete currentUser={currentUser} />
    </div>
  );
};

export default DeletePage;
