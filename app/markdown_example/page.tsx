import getKatexExample from "@/actions/Admin/getKatexExample";
import ClientWrapper from "./_componentes/ClientWrapper";
import getCurrentUser from "@/actions/getCurrentUser";
import Redirector from "@/components/Redirector";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Notation Example",
};
const MarkdownExamplePage = async () => {
  const [currentUser, katexExample] = await Promise.all([
    getCurrentUser(),
    getKatexExample(),
  ]);

  return (
    <>
      {currentUser ? (
        <div className="w-full mt-2 bg-yt-bg text-yt-white flex flex-col items-center px-3 h-auto max-h-screen overflow-y-auto ">
          <div className="w-full  lg:w-3/4 xl:2/3 text-lg mb-2 pt-2 font-semibold text-center text-green-500">
            Markdown Notation Example
          </div>

          <div className="w-full lg:w-3/4 xl:2/3">
            <ClientWrapper katexExample={katexExample} />
          </div>
        </div>
      ) : (
        <Redirector />
      )}{" "}
    </>
  );
};

export default MarkdownExamplePage;
