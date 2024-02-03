import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

interface IUseInterest {
  interestId: string;
  currentUser: User | null;
}

const useInterest = ({ interestId, currentUser }: IUseInterest) => {
  const router = useRouter();
  const hasInterest = useMemo(() => {
    const list = currentUser?.interestIds || [];
    return list.includes(interestId);
  }, [currentUser?.interestIds, interestId]);

  const toggleInterest = useCallback(async () => {
    if (!currentUser) return;
    try {
      const toastMessage = hasInterest
        ? "関心をはずしました"
        : "関心を登録しました";
      let request;

      if (hasInterest) {
        request = () => axios.delete(`/api/interest/${interestId}`);
      } else {
        request = () => axios.post(`/api/interest/${interestId}`);
      }

      await request();
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  }, [currentUser, hasInterest, interestId, router]);
  return { hasInterest, toggleInterest };
};

export default useInterest;
