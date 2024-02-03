"use client";

import axios from "axios";
import { useState } from "react";

const AdminStripeDashboard = () => {
  const [isStripePause, setIsStripePause] = useState(false);

  const handleClick = async () => {
    await axios.post("/api/admin/stripe", {
      isStripePause,
    });
  };

  return (
    <div className="w-5/6 flex flex-col items-center pt-10 text-yt-white gap-3">
      <div>Stripe</div>
      <div className="flex items-center">
        <input
          id="stripeCheck"
          type="checkbox"
          className="w-5 h-5 mr-2"
          checked={isStripePause}
          onChange={(e) => {
            setIsStripePause(e.target.checked);
          }}
        />
        <label htmlFor="stripeCheck" className="cursor-pointer">
          審査一時停止中
        </label>
      </div>
      <div className="w-full flex justify-center">
        <button
          className="bg-rose-500 w-1/4 py-2 h-auto rounded-xl hover:bg-rose-300 cursor-pointer"
          onClick={handleClick}
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default AdminStripeDashboard;
