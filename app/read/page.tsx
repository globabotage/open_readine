import { Metadata } from "next";
import ReadForm from "./_components/ReadForm";
import getInterests from "@/actions/Interest/getInterests";

export const metadata: Metadata = {
  title: "行間を読む | Readine",
};

const ReadPage = async () => {
  const originalInterests = await getInterests();

  return (
    <div className="w-full h-screen overflow-y-scroll bg-yt-bg text-yt-white">
      {/* -mt-20はnabbarの高さ分のマイナスマージン */}
      <ReadForm originalInterests={originalInterests} />
    </div>
  );
};

export default ReadPage;
