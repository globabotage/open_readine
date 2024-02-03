"use client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RedirectMyInterestProps {
  currentUser: User | null;
}
const RedirectMyInterest: React.FC<RedirectMyInterestProps> = ({
  currentUser,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.interestIds.length > 0) {
      router.push("/my_interests");
    }
  }, [currentUser, router]);

  return (
    <div className=" w-full h-full absolute top-1/2 text-yt-text-gray text-lg font-light text-center">
      Redirecting...
    </div>
  );
};

export default RedirectMyInterest;
