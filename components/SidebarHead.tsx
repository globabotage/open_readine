import MyInterestsCard from "@/app/my_interests/_components/MyInterestsCard";

import getBookById from "@/actions/Book/getBookById";
import getInterestById from "@/actions/Interest/getInterestById";
import { SafeBook } from "@/types";
import InterestCard from "./InterestCard";
import { Params } from "@/app/book/[bookId]/page";
import getCurrentUser from "@/actions/getCurrentUser";
import BookCard from "./Book/BookCard";
import PagenateButton from "./PagenateButton";

interface SidebarHeadProps {
  params: Params;
  myInterestPage?: boolean;
  interestPage?: boolean;
  bookPage?: boolean;
  page: number;
  pages: number[] | null;
  defaultPath: string;
}

const SidebarHead: React.FC<SidebarHeadProps> = async ({
  params,
  myInterestPage,
  interestPage,
  bookPage,
  page,
  pages,
  defaultPath,
}) => {
  const [book, interest, currentUser] = await Promise.all([
    bookPage ? getBookById(params.bookId) : null,
    interestPage ? getInterestById(params) : null,
    getCurrentUser(),
  ]);
  return (
    <section className="w-full h-auto flex flex-col">
      {myInterestPage && <MyInterestsCard currentUser={currentUser} />}

      {bookPage && (
        <BookCard
          bookdata={book as SafeBook}
          sidebar
          currentUser={currentUser}
        />
      )}
      {interestPage && (
        <InterestCard interest={interest} sidebar currentUser={currentUser} />
      )}
      <div className="flex flex-row justify-center w-full h-auto bg-black space-x-1 pb-2">
        {pages?.map((item) => (
          <PagenateButton
            key={item}
            item={item}
            page={page}
            defaultPath={defaultPath}
            currentUser={currentUser}
          />
        ))}
      </div>
    </section>
  );
};

export default SidebarHead;
