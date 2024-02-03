import { User } from "@prisma/client";
import EditProfButton from "./EditProfButton";
import ReadMoreProf from "./ReadMoreProf";

interface WriterCardProps {
  writer: User | null;
  currentUser?: User | null;
}

const WriterCard: React.FC<WriterCardProps> = ({ writer, currentUser }) => {
  const detailLimit = 75;
  return (
    <>
      <div className="  w-full h-auto mt-5 flex justify-center ">
        <div className="w-full h-auto md:w-2/3 lg:w-1/2  flex flex-col justify-center items-center space-y-2  ">
          <div className="w-full h-auto flex flex-row justify-center">
            <div className="basis-1/5" />
            <h1 className="basis-3/5 text-center text-indigo-200 font-semibold text-xl">
              {writer?.name}
            </h1>
            <div className="basis-1/5 flex justify-end">
              <EditProfButton currentUser={currentUser} writer={writer} />
            </div>
          </div>

          <div className="w-full h-auto px-2 flex flex-col items-center ">
            <div className="w-full px-2 h-auto text-yt-text-gray flex-wrap">
              {writer?.detail && writer.detail.length > detailLimit
                ? writer?.detail?.slice(0, detailLimit) + "..."
                : writer?.detail}
            </div>
            {writer?.detail && writer.detail.length > detailLimit && (
              <ReadMoreProf />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WriterCard;
