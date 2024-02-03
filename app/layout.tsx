import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar/Navbar";
import getCurrentUser from "../actions/getCurrentUser";
import ToasterProvider from "@/providers/ToasterProvider";
import SearchModal from "@/components/modals/SearchModal";
import DeleteModal from "@/components/modals/DeleteModal";
import UploadImageModal from "@/components/modals/UploadImageModal";
import getThanks from "@/actions/Thanks/getThanks";

import "./globals.css";
import ReCaptchaModals from "@/components/modals/ModalWrapper";
import AuthProvider from "@/providers/AuthProvider";
import MathJaxWrapper from "@/components/preview/MathJaxWrapper";
import Script from "next/script";
import getThanksRequests from "@/actions/Thanks/getThanksRequests";
import getPaymentRequests from "@/actions/Thanks/getPaymentRequests";

export const metadata = {
  title: "Readine",
  description:
    "Readineはテキストの行間を読み解き、その洞察を共有するためのウェブサイトです。どなたでも投稿が可能です。",
};
// In the app directory, next/head is replaced with a new head.js special file(https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, thanks, thanksRequests, paymentRequests] =
    await Promise.all([
      getCurrentUser(),
      getThanks(),
      getThanksRequests(),
      getPaymentRequests(),
    ]);

  return (
    <html lang="ja">
      <body className={`bg-yt-bg w-full h-auto overflow-hidden `}>
        {/* ↑overflow-hiddenとしないと上下スクロールで全体が動く */}
        <AuthProvider>
          <MathJaxWrapper>
            <Navbar
              currentUser={currentUser}
              thanks={thanks}
              thanksRequests={thanksRequests}
              paymentRequests={paymentRequests}
            />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
            />
            <Script id="google-analytics">
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
     
              gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
            `}
            </Script>
            <div className="w-full h-auto ">{children}</div>
            <SpeedInsights />
            <SearchModal currentUser={currentUser} />
            <DeleteModal />
            <UploadImageModal />
            <ReCaptchaModals />
            <ToasterProvider />
          </MathJaxWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
