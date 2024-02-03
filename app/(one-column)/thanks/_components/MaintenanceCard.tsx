"use client";
import { LuAlertTriangle } from "react-icons/lu";

const MaintenanceCard = () => {
  return (
    <div className="flex  items-center text-yt-white px-3 py-3 rounded-lg text-sm bg-rose-800 mb-3">
      <LuAlertTriangle size={18} />
      &nbsp;
      現在、Thanks機能はシステムメンテナンス中です。復旧までいましばらくお待ち下さい。
    </div>
  );
};

export default MaintenanceCard;
