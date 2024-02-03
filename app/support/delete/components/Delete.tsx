"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

interface DeleteProps {
  currentUser: User | null;
}
const Delete: React.FC<DeleteProps> = ({ currentUser }) => {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const clickHander = async () => {
    await axios
      .post("/api/delete_account")
      .then(() => {
        toast.success("アカウントは削除されました。");
        LogOut();
      })
      .catch((err) => console.log(err));
  };

  const LogOut = () => {
    signOut();
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  return (
    <div className="w-full h-auto flex flex-col items-center space-y-5">
      <div className="flex items-center">
        <input
          id="delete"
          type="checkbox"
          className=" h-5 w-5 cursor-pointer
           bg-white 
          "
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <label
          className="ml-3 text-yt-text-gray cursor-pointer"
          htmlFor="delete"
        >
          上記の注意事項を理解しました。アカウントの削除を続行します。
        </label>
      </div>
      <div>
        <button
          className="w-auto px-5 py-2 rounded-md bg-yt-component hover:bg-yt-atom disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={clickHander}
          disabled={!checked}
        >
          アカウントを削除
        </button>
      </div>
    </div>
  );
};

export default Delete;
