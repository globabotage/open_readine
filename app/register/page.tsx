import getIsValidLink from "@/actions/getIsValidLink";
import Register from "./_components/Register";

interface SearchParams {
  token: string;
}

export const metadata = {
  title: "Register | Readine",
};

const RegisterPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const token = searchParams.token;
  const isValidLink = await getIsValidLink(token);

  let body;

  if (isValidLink) {
    body = <Register token={token} />;
  } else {
    body = (
      <div className="mt-24 w-full h-auto text-yt-white text-xl text-center flex flex-col items-center">
        <div>ページの有効期限が切れています。</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center h-auto ">{body}</div>
    </>
  );
};

export default RegisterPage;
