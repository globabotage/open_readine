import getBooks from "@/actions/Admin/getBooks";
import AddButton from "./_components/AddButton";

import Manual from "./_components/Manual";

const BookAlphabetPage = async () => {
  const books = await getBooks();

  return (
    <div className="w-full h-auto max-h-screen mt-12 overflow-y-auto flex justify-center pb-24">
      <table className="w-5/6 ">
        <thead className="w-full h-auto">
          <tr>
            <th className="w-2/6 border-2 border-yt-atom">Title</th>
            <th className="w-2/6 border-2 border-yt-atom">Title Alphabet</th>
            <th className="w-1/6 border-2 border-yt-atom">GPT</th>
            <th className="w-1/6 border-2 border-yt-atom">Manual</th>
          </tr>
        </thead>
        <tbody className="w-full h-auto">
          {books?.map((book) => (
            <tr key={book.id} className="">
              <td className="w-2/6 border-2 border-yt-atom">{book.title}</td>
              <td className="w-2/6  border-2 border-yt-atom">
                {book.titleAlphabet}
              </td>
              <td className="w-1/6  border-2 border-yt-atom text-center">
                <AddButton book={book} />
              </td>
              <td className="w-1/6  border-2 border-yt-atom">
                <Manual book={book} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookAlphabetPage;
