"use client";
import axios from "axios";

const Test = () => {
  const getSession = async () => {
    const res = await axios.get("/api/auth/session");

    console.log(res);
  };

  return (
    <div className="flex flex-row justify-center">
      <button
        className="px-2 py-2 bg-white rounded-xl"
        onClick={() => getSession()}
        disabled
      >
        get session
      </button>
    </div>
  );
};

export default Test;
