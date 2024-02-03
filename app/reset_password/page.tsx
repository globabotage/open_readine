import getIsValidLink from "@/actions/getIsValidLink";
import ResetPassword from "./_components/ResetPassword";

interface SearchParams {
  token: string;
}

export const metadata = {
  title: "Reset Password | Readine",
};

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const token = searchParams.token;
  const isValidLink = await getIsValidLink(token);

  let body;

  if (isValidLink) {
    body = <ResetPassword token={token} />;
  } else {
    body = (
      <div className="mt-24 w-full h-auto text-yt-white text-xl text-center flex flex-col items-center">
        <div>ページの有効期限が切れています。</div>
      </div>
    );
  }
  return <div className="flex justify-center h-auto ">{body}</div>;
};

export default ResetPasswordPage;
