import getCurrentUser from "@/actions/getCurrentUser";
import Test from "../components/Test";
interface Params {
  pass: string;
}
const TestPage = async ({ params }: { params: Params }) => {
  const currentUser = await getCurrentUser();
  const adminEmail = process.env.ADMIN_EMAIL;

  const isAuthorized = currentUser?.email === adminEmail;

  const adminPass = process.env.ADMIN_PASS;
  const isAuthorizedPass = params.pass === adminPass;
  return (
    <div className=" mt-24 w-full h-auto ">
      {!isAuthorized || !isAuthorizedPass ? (
        <div className="text-yt-white w-full text-center">not found</div>
      ) : (
        <Test />
      )}
    </div>
  );
};

export default TestPage;
