import { User } from "@prisma/client";

interface BookmarkHeaderProps {
  currentUser: User | null;
}
const BookmarkHeader: React.FC<BookmarkHeaderProps> = ({ currentUser }) => {
  return (
    <div className="w-full flex justify-center items-center mt-5 mb-3 sm:mt-7 text-center text-sm text-yt-white">
      <span className="mr-1 text-base">🔖</span>
      <span className="text-indigo-300">{currentUser?.name}</span>
      &nbsp;のブックマーク
    </div>
  );
};

export default BookmarkHeader;
