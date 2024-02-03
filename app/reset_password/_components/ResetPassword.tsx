"use client";
import Button from "@/components/Button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useLoginModal from "@/hooks/modal/useLoginModal";

interface ResetPasswordProps {
  token: string;
}
const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const loginModal = useLoginModal();

  const clickHandler = async () => {
    if (newPassword !== newPasswordConfirm) {
      alert("確認用パスワードが一致しません");
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 20) {
      alert("パスワードは8文字以上20文字以下で入力してください。");
      return;
    }
    await axios
      .post(`/api/reset_password/${token}`, {
        password: newPassword,
      })
      .then((res) => {
        if (res.data === "expired") {
          toast.error("ページの有効期限が切れています");
          return;
        }

        toast.success("パスワードを変更しました。");
        loginModal.onOpen();
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mt-24 w-full h-auto flex flex-col gap-4 items-center ">
      <div className="w-1/3 h-auto p-1">
        <div className="pl-3 text-yt-white">新しいパスワード</div>
        <input
          className="px-3 py-2 w-full rounded-xl focus:outline-green-500 "
          placeholder="new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          maxLength={20}
          type="password"
        />
      </div>
      <div className="w-1/3 h-auto p-1">
        <div className="pl-3  text-yt-white">新しいパスワード（確認用）</div>
        <input
          className="px-3 py-2 w-full rounded-xl focus:outline-green-500 "
          placeholder="new password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          minLength={8}
          maxLength={20}
          type="password"
        />
      </div>
      <div className="w-1/4 mt-5">
        <Button label="パスワードを変更" onClick={clickHandler} />
      </div>
    </div>
  );
};

export default ResetPassword;
