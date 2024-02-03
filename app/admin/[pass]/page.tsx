import getCurrentUser from "@/actions/getCurrentUser";

import Admin from "./_components/Admin";
import getAdminOthers from "@/actions/Admin/Full/getAdminOthers";
import getUnCheckedBetween from "@/actions/Admin/Full/getUnCheckedBetween";
import getUnCheckedLines from "@/actions/Admin/Full/getUnCheckedLines";
import { Between, Lines } from "@prisma/client";
import Redirector from "@/components/Redirector";
interface Params {
  pass: string;
}

const AdminPage = async ({ params }: { params: Params }) => {
  const [unCheckedLines, unCheckedBetween, data, currentUser] =
    await Promise.all([
      getUnCheckedLines(),
      getUnCheckedBetween(),
      getAdminOthers(),
      getCurrentUser(),
    ]);

  const adminEmail = process.env.ADMIN_EMAIL;

  const isAuthorized = currentUser?.email === adminEmail;

  const adminPass = process.env.ADMIN_PASS;
  const isAuthorizedPass = params.pass === adminPass;

  return (
    <>
      {!isAuthorized || !isAuthorizedPass ? (
        <Redirector />
      ) : (
        <Admin
          unCheckedLines={unCheckedLines as Lines[]}
          unCheckedBetween={unCheckedBetween as Between[]}
          nonApprovedLines={data?.nonApprovedLines as Lines[]}
          nonApprovedBetween={data?.nonApprovedBetween as Between[]}
          rejectedUsers={data?.rejectedUsers as any[]}
        />
      )}
    </>
  );
};

export default AdminPage;
