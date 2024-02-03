import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface IuseBookmarkBook {
  currentUser: User | null;
  bookId: string;
}

const useBookmarkBook = ({ bookId, currentUser }: IuseBookmarkBook) => {
  const router = useRouter();
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const hasBookmarkBook = useMemo(() => {
    return currentUser?.bookmarkBookIds?.includes(bookId) || false;
  }, [currentUser?.bookmarkBookIds, bookId]);

  const toggleBookmarkBook = useCallback(async () => {
    setIsBookmarkLoading(true);
    if (!currentUser) return;

    const isRemoving = hasBookmarkBook;

    const toastMessage = hasBookmarkBook
      ? "ブックマークからはずしました"
      : "ブックマークに追加しました";
    const request = isRemoving
      ? axios.delete(`/api/bookmark/book/${bookId}`)
      : axios.post(`/api/bookmark/book/${bookId}`);

    try {
      await request;

      toast.success(toastMessage);
      router.refresh();
      setTimeout(() => {
        setIsBookmarkLoading(false);
      }, 1500);
    } catch (error: any) {
      toast.error("Something went wrong");
      setIsBookmarkLoading(false);
    }
  }, [currentUser, hasBookmarkBook, bookId, router]);

  useEffect(() => {
    setTimeout(() => {
      (window as any).MathJax?.typesetPromise?.();
    }, 300);
    //if not, mathjax will not render after toggling bookmark on Android
    //It probablly because of router refresh
    //It's also set in BetweenList.tsx
  }, [isBookmarkLoading]);

  return { hasBookmarkBook, toggleBookmarkBook, isBookmarkLoading };
};

export default useBookmarkBook;
