"use client";

import Loader from "@/components/loader/Loader";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Loading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = params.get("pathname");

  useEffect(() => {
    const register = async () => {
      const res = await axios.post("/api/stripe/success", {
        sessionId: params.get("session_id"),
        userId: params.get("user"),
      });

      router.push(pathname as string);
      setIsLoading(false);
    };
    register();
  }, [params, pathname, router]);

  return <div className="text-yt-white">{isLoading && <Loader />}</div>;
};

export default Loading;
