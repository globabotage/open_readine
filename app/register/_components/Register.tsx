"use client";
import useLoginModal from "@/hooks/modal/useLoginModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface RegisterProps {
  token: string;
}

const Register: React.FC<RegisterProps> = ({ token }) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  useEffect(() => {
    const completeRegister = async () => {
      await axios.post(`/api/register/${token}`).then((res) => {
        if (res.data === "expired") {
          toast.error("ページの有効期限が切れています");
          router.push("/");
          return;
        }
        router.push("/");
        loginModal.onOpen();
      });
    };

    completeRegister();
  }, []); //dependencies should be empty

  return (
    <div className="mt-24 w-full h-auto flex flex-col gap-4 items-center  text-readine-green">
      <div>登録が完了しました！ </div>
    </div>
  );
};

export default Register;
