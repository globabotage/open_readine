import Link from "next/link";

const AdminSidebar = () => {
  const linkStyle =
    "px-2 py-1 w-full h-auto bg-indigo-900 rounded-md hover:bg-indigo-500 border-2 border-indigo-400 text-center";
  return (
    <div className="w-1/6 h-auto flex flex-col items-start gap-3 pt-5 pl-1">
      <Link
        className={`${linkStyle}`}
        href={`/admin/${process.env.ADMIN_PASS}`}
      >
        Post Approval
      </Link>

      <Link
        href={`/admin/${process.env.ADMIN_PASS}/stripe`}
        className={`${linkStyle}`}
      >
        Stripe
      </Link>
      <Link
        href={`/admin/${process.env.ADMIN_PASS}/katex`}
        className={`${linkStyle}`}
      >
        KaTeX example
      </Link>
      <Link
        href={`/admin/${process.env.ADMIN_PASS}/book_alphabet`}
        className={`${linkStyle}`}
      >
        Book alphabet
      </Link>
      <Link
        href={`/admin/${process.env.ADMIN_PASS}/gpt`}
        className={`${linkStyle}`}
      >
        GPT
      </Link>
    </div>
  );
};

export default AdminSidebar;
