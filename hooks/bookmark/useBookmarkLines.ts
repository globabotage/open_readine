import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface IuseBookmarkLines {
  currentUser: User | null;
  linesId: string;
}

const useBookmarkLines = ({ linesId, currentUser }: IuseBookmarkLines) => {
  const router = useRouter();
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const hasBookmarkLines = useMemo(() => {
    return currentUser?.bookmarkLinesIds?.includes(linesId) || false;
  }, [currentUser?.bookmarkLinesIds, linesId]);

  const toggleBookmarkLines = useCallback(async () => {
    setIsBookmarkLoading(true);
    if (!currentUser) return;

    const isRemoving = hasBookmarkLines;
    const toastMessage = isRemoving
      ? "ブックマークからはずしました"
      : "ブックマークに追加しました";
    const request = isRemoving
      ? axios.delete(`/api/bookmark/lines/${linesId}`)
      : axios.post(`/api/bookmark/lines/${linesId}`);

    try {
      await request;
      toast.success(toastMessage);

      router.refresh();
      setTimeout(() => {
        setIsBookmarkLoading(false);
      }, 1500);
    } catch (err) {
      toast.error("Something went wrong");
      setIsBookmarkLoading(false);
    }
  }, [currentUser, hasBookmarkLines, linesId, router]);

  return { hasBookmarkLines, toggleBookmarkLines, isBookmarkLoading };
};

export default useBookmarkLines;
