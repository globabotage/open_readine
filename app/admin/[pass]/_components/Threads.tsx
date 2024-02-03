"use client";
import BetweenCard from "@/components/Between/BetweenCard";
import LinesCard from "@/components/Lines/LinesCard";

import { SafeBetween, SafeLines } from "@/types";
import axios from "axios";
import { Sofia_Sans } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { BeatLoader } from "react-spinners";

interface ThreadsProps {
  RejectedUsers?: any[];
  LinesArray?: SafeLines[];
  BetweenArray?: SafeBetween[];
  NonApproved?: boolean;
}

const Threads: React.FC<ThreadsProps> = ({
  LinesArray,
  BetweenArray,
  RejectedUsers,
  NonApproved,
}) => {
  const router = useRouter();
  const [checkedLinesIds, setCheckedLinesIds] = useState<string[]>([]);
  const [checkedBetweenIds, setCheckedBetweenIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkLines = async (id: string) => {
    const res = await axios.post("/api/admin", {
      id,
      type: "check_lines",
    });
    router.refresh();
  };

  const checkLinesArray = async () => {
    setIsLoading(true);
    const res = await axios.post("/api/admin", {
      ids: checkedLinesIds,
      type: "check_lines_array",
    });

    setCheckedLinesIds([]);
    setIsLoading(false);
    router.refresh();
  };

  const rejectLines = async (id: string) => {
    const res = await axios.post("/api/admin", {
      id,
      type: "reject_lines",
    });
    router.refresh();
  };

  const updateLines = async (id: string) => {
    const res = await axios.post("/api/admin", {
      id,
      type: "update_lines",
    });
    router.refresh();
  };

  const checkBetween = async (id: string) => {
    const res = await axios.post("/api/admin", {
      id,
      type: "check_between",
    });
    router.refresh();
  };

  const checkBetweenArray = async () => {
    setIsLoading(true);
    const res = await axios.post("/api/admin", {
      ids: checkedBetweenIds,
      type: "check_between_array",
    });
    setCheckedBetweenIds([]);
    setIsLoading(false);
    router.refresh();
  };

  const rejectBetween = async (id: string) => {
    const res = await axios.post("/api/admin", {
      id,
      type: "reject_between",
    });
    router.refresh();
  };

  const updateBetween = async (id: string) => {
    const res = await axios.post("/api/admin", {
      id,
      type: "update_between",
    });
    router.refresh();
  };

  const rejectUser = async (id: string) => {
    const res = await axios.post("/api/admin", {
      id,
      type: "reject_user",
    });
    router.refresh();
  };

  const removeRejected = async (id: string) => {
    const res = await axios.post("/api/admin", {
      id,
      type: "remove_rejected",
    });
    router.refresh();
  };

  const checkAllHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (LinesArray) {
        setCheckedLinesIds(LinesArray?.map((line) => line.id) as string[]);
      } else if (BetweenArray) {
        setCheckedBetweenIds(
          BetweenArray?.map((between) => between.id) as string[]
        );
      } else {
        return;
      }
    } else {
      setCheckedBetweenIds([]);
      setCheckedLinesIds([]);
    }
  };

  useEffect(() => {
    console.log(checkedLinesIds);
  }, [checkedLinesIds]);

  return (
    <>
      <div className="w-full h-auto  sticky top-14 z-20 pt-2 bg-yt-bg">
        <div className="w-full h-auto flex justify-between">
          <div className="flex items-center">
            <input
              id="check-all"
              type="checkbox"
              className="w-5 h-5 cursor-pointer mr-1"
              checked={
                LinesArray
                  ? checkedLinesIds.length === LinesArray?.length
                  : BetweenArray
                  ? checkedBetweenIds.length === BetweenArray?.length
                  : false
              }
              onChange={(e) => {
                checkAllHandler(e);
              }}
            />
            <label htmlFor="check-all" className="cursor-pointer">
              CHECK ALL
            </label>
          </div>

          <button
            className="px-3 w-[300px] py-1 bg-green-700 rounded-xl hover:bg-opacity-80 text-sm"
            onClick={
              LinesArray
                ? checkLinesArray
                : BetweenArray
                ? checkBetweenArray
                : () => {}
            }
          >
            {!isLoading ? (
              <span>Approve checked items</span>
            ) : (
              <BeatLoader color="#36d7b7" />
            )}
          </button>
        </div>

        <hr className="mt-3 mb-5 " />
      </div>{" "}
      <div className="w-full h-auto  min-h-screen flex flex-col items-center space-y-2 px-3 pb-[30px]">
        {LinesArray &&
          LinesArray?.map((line, index) => (
            <div key={line.id} className="w-full">
              <div className="w-full flex flex-row space-x-5 items-center">
                <input
                  id={line.id}
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer"
                  checked={checkedLinesIds.includes(line.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedLinesIds([...checkedLinesIds, line.id]);
                    } else {
                      setCheckedLinesIds(
                        checkedLinesIds.filter((id) => id !== line.id)
                      );
                    }
                  }}
                />
                <button
                  className="px-3 w-auto py-1 bg-green-500 rounded-xl hover:bg-opacity-80"
                  onClick={() =>
                    !NonApproved ? checkLines(line.id) : updateLines(line.id)
                  }
                >
                  Approve
                </button>
                {!NonApproved && (
                  <button
                    className="px-3 w-auto py-1 bg-rose-500 rounded-xl hover:bg-opacity-80"
                    onClick={() => rejectLines(line.id)}
                  >
                    Reject
                  </button>
                )}
              </div>

              <Link
                href={`/book/${line.bookId}?linesId=${line.id}`}
                target="_blank"
              >
                <LinesCard lines={line} />
              </Link>
              <div className="flex w-ful justify-end mt-1">
                <button
                  className="px-3 w-auto py-1  bg-violet-500 rounded-xl hover:bg-opacity-80 text-sm"
                  onClick={() => rejectUser(line.userId)}
                >
                  Reject User
                </button>
              </div>
              {index !== LinesArray.length - 1 && <hr className="mt-3 mb-5" />}
            </div>
          ))}
        {BetweenArray &&
          BetweenArray?.map((between) => (
            <div key={between.id} className="w-full h-auto">
              <div className="w-full flex flex-row items-center space-x-5 mb-2">
                <input
                  id={between.id}
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer"
                  checked={checkedBetweenIds.includes(between.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedBetweenIds([...checkedBetweenIds, between.id]);
                    } else {
                      setCheckedBetweenIds(
                        checkedBetweenIds.filter((id) => id !== between.id)
                      );
                    }
                  }}
                />
                <button
                  className="px-3 w-auto py-1 bg-green-500 rounded-xl hover:bg-opacity-80"
                  onClick={() =>
                    !NonApproved
                      ? checkBetween(between.id)
                      : updateBetween(between.id)
                  }
                >
                  Approve
                </button>
                {!NonApproved && (
                  <button
                    className="px-3 w-auto py-1 bg-rose-500 rounded-xl hover:bg-opacity-80"
                    onClick={() => rejectBetween(between.id)}
                  >
                    Reject
                  </button>
                )}
              </div>

              <Link
                href={`/book/${between.lines?.bookId}?linesId=${between.linesId}`}
                target="_blank"
              >
                <BetweenCard between={between} />
              </Link>
              <div className="flex w-ful justify-end">
                <button
                  className="px-3 w-auto py-1  bg-violet-500 rounded-xl hover:bg-opacity-80 text-sm"
                  onClick={() => rejectUser(between.userId)}
                >
                  Reject User
                </button>
              </div>
              {between.id !== BetweenArray[BetweenArray.length - 1].id && (
                <hr className="mt-3 mb-5" />
              )}
            </div>
          ))}
        {!LinesArray &&
          !BetweenArray &&
          RejectedUsers &&
          RejectedUsers.map((item) => (
            <div key={item.id} className="w-3/4 ">
              <div className="w-full flex flex-row items-center justify-between">
                <Link
                  className="w-auto px-3 py-1 rounded-sm bg-violet-800 
                hover:bg-opacity-80  flex items-center space-x-3"
                  href={`/writer/${item.user.id}`}
                  target="_blank"
                >
                  <div>{item.user.name}</div>
                  <FiExternalLink size={15} />
                </Link>
                <div>
                  <button
                    className="bg-yt-component hover:bg-yt-atom px-3 py-1 rounded-xl"
                    onClick={() => removeRejected(item.id)}
                  >
                    Approve this user
                  </button>
                </div>
              </div>

              <hr className="my-5" />
            </div>
          ))}
      </div>
    </>
  );
};

export default Threads;
