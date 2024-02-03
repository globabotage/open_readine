import getCurrentUser from "@/actions/getCurrentUser";
import Application from "./_components/Application";
import ThanksHeader from "./_components/ThanksHeader";
import getStripeAccount from "@/actions/getStripeAccount";
import ThanksDashboard from "./_components/ThanksDashboard";
import getThanks from "@/actions/Thanks/getThanks";
import getStripeState from "@/actions/Admin/getStripeState";
import Redirector from "@/components/Redirector";
import FilterBar from "./_components/FilterBar";
import PaymentHistory from "./_components/PaymentHistory";
import getPayments from "@/actions/Thanks/getPayments";
import getThanksRequests from "@/actions/Thanks/getThanksRequests";
import getPaymentRequests from "@/actions/Thanks/getPaymentRequests";

export const metadata = {
  title: "Thanks | Readine",
};

interface SearchParams {
  filter: string;
}

const ThanksApplicationPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const [
    currentUser,
    account,
    thanks,
    thanksRequests,
    payments,
    paymentRequests,
    IsStripePause,
  ] = await Promise.all([
    getCurrentUser(),
    getStripeAccount(),
    getThanks(),
    getThanksRequests(),
    getPayments(),
    getPaymentRequests(),
    getStripeState(),
  ]);

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAuthorized = currentUser?.email === adminEmail;

  const isStripePause = IsStripePause && !isAuthorized;

  return (
    <>
      {currentUser === null ? (
        <Redirector />
      ) : (
        <div className="w-full h-auto max-h-[92vh] overflow-y-scroll  text-yt-white  flex flex-col items-center ">
          <FilterBar
            filter={searchParams.filter ? searchParams.filter : null}
          />
          <div className="w-full md:w-2/3 lg:w-1/2  h-auto flex flex-col items-center pt-3">
            {!searchParams.filter && account && (
              <>
                <ThanksHeader
                  currentUser={currentUser}
                  account={account}
                  isStripePause={isStripePause}
                />
                <ThanksDashboard thanks={thanks} />
              </>
            )}
            {!searchParams.filter && !account && (
              <Application
                currentUser={currentUser}
                isStripePause={isStripePause}
                thanksRequests={thanksRequests}
              />
            )}
            {searchParams.filter === "payment" && (
              <ThanksDashboard
                thanks={payments}
                paymentRequests={paymentRequests}
                payment
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ThanksApplicationPage;
