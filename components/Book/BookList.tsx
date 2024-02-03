import { SafeBook } from "@/types";
import { User } from "@prisma/client";
import BookCard from "./BookCard";

interface BooklistProps {
  books: SafeBook[];
  currentUser?: User | null;
}

const BookList: React.FC<BooklistProps> = ({ books, currentUser }) => {
  return (
    <section className="w-auto h-auto space-y-2">
      {books.map((book, index) => (
        <BookCard key={index} bookdata={book} currentUser={currentUser} />
      ))}
    </section>
  );
};

export default BookList;
