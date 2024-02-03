"use client";
import { SafeLines } from "@/types";
import { Between, Book, Interest, User } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

interface OldData {
  users: User[];
  linesArray: SafeLines[];
  interests: Interest[];
  books: Book[];
  betweenArray: Between[];
  interest_proposals: any[];
  user_interests: any[];
}

const OldReadine = () => {
  const [oldData, setOldData] = useState<OldData | null>(null);
  useEffect(() => {
    const getReadine = async () => {
      const res = await axios.get("http://localhost:8000/api/readine");
      setOldData(res.data);
    };
    getReadine();
  }, []);

  const register = async () => {
    const res = await axios.post("/api/old_readine", {
      users: oldData?.users,
      linesArray: oldData?.linesArray,
      interests: oldData?.interests,
      books: oldData?.books,
      betweenArray: oldData?.betweenArray,
      interest_proposals: oldData?.interest_proposals,
      user_interests: oldData?.user_interests,
    });
    console.log(res.data);
  };

  const update = async () => {
    const res = await axios.post("/api/old_readine/update", {
      linesArray: oldData?.linesArray,
      betweenArray: oldData?.betweenArray,
    });

    console.log(res.data);
  };

  const updateString = async () => {
    const res = await axios.post("/api/old_readine/update/string", {
      linesArray: oldData?.linesArray,
      betweenArray: oldData?.betweenArray,
    });

    console.log(res.data);
  };

  return (
    <div className=" mt-28 w-full  flex flex-col items-center gap-3 text-white justify-center ">
      <button
        className="w-1/2 px-3 py-2 bg-black hover:bg-yt-atom rounded-xl cursor-pointer border-2 border-yt-white
          disabled:opacity-30 disabled:cursor-not-allowed
        "
        onClick={register}
        disabled={true}
      >
        登録
      </button>
      <button
        className="w-1/2 px-3 py-2 bg-black hover:bg-yt-atom rounded-xl cursor-pointer border-2 border-yt-white
        disabled:opacity-30 disabled:cursor-not-allowed
      "
        onClick={update}
        disabled={true}
      >
        更新
      </button>
      <button
        className="w-1/2 px-3 py-2 bg-black hover:bg-yt-atom rounded-xl cursor-pointer border-2 border-yt-white
        disabled:opacity-30 disabled:cursor-not-allowed
      "
        onClick={updateString}
        // disabled={true}
      >
        コンテンツ文字列の更新
      </button>
    </div>
  );
};

export default OldReadine;
