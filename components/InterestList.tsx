import { Interest } from "@prisma/client";
import InterestCard from "./InterestCard";

interface InterestListProps {
  interestArray?: Interest[] | null;
  center?: boolean;
}

const InterestList: React.FC<InterestListProps> = ({
  interestArray,
  center,
}) => {
  return (
    <section className={`w-full flex justify-center z-10`}>
      <div
        className={` flex py-1 flex-wrap
     ${center ? "justify-center w-3/4 " : "justify-end w-full"}`}
      >
        {interestArray?.map((interest) => (
          <div key={interest.id} className={`${center ? "mt-2 mr-1" : "mt-1"}`}>
            <InterestCard interest={interest} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default InterestList;
