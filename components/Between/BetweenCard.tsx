"use client";
import { SafeBetween } from "@/types";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, set, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { MdCreate, MdDelete } from "react-icons/md";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { BetweenEditorState } from "./BetweenList";

import { UploadedImage, User } from "@prisma/client";
import useToggleBetween from "@/hooks/useToggleBetween";
import BetweenImageList from "./BetweenImageList";
import InputBox from "../editor/InputBox";
import ThanksButton from "../ThanksButton";
import Preview from "../preview/Preview";
import dayjs from "dayjs";
import PrivateIcon from "../preview/PrivateIcon";
import useDeleteModal from "@/hooks/modal/useDeleteModal";
import useLoadingPost from "@/hooks/loading/useLoadingPost";
import Link from "next/link";
import AskGpt from "../AskGpt";

interface BetweenCardProps {
  between?: SafeBetween;
  linesId?: string;
  currentUser?: User | null;
  setBetweenEditorState?: React.Dispatch<
    React.SetStateAction<BetweenEditorState[]>
  >;
  labelTop?: string | React.ReactElement;
}

const BetweenCard: React.FC<BetweenCardProps> = ({
  between,
  linesId,
  currentUser,
  setBetweenEditorState,
  labelTop,
}) => {
  const router = useRouter();
  const deleteModal = useDeleteModal();
  const { setIsLoading } = useLoadingPost();

  const betweenId = useMemo(() => {
    return between ? between.id : -1;
  }, [between]);

  const isEdited = between ? between.createdAt !== between.updatedAt : false;
  const [isEditorOpen, setIsEditorOpen] = useState(!between ? true : false);
  const { setIsText } = useToggleBetween();

  const hasImage = between?.uploadedImages?.length !== 0;

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      linesId: linesId,
      between: between?.content,
      isPrivate: between?.isPrivate || false,
      imageUrls: [],
    },
  });

  const isMathJax = useMemo(() => {
    if (between?.content?.includes("math-tex")) {
      return true;
    }
    return false;
  }, [between?.content]);

  useEffect(() => {
    if (between) {
      setValue("linesId", between.linesId);
      setValue("between", between.content);
      setValue("isPrivate", between.isPrivate);
    }
  }, [between, setValue]);

  const onOpen = useCallback(() => {
    axios.delete(`/api/upload_image/initialize`); //同期処理でOK
    setIsText(!hasImage);
    setIsEditorOpen(true);
    setBetweenEditorState?.((prev) =>
      prev.map((state) =>
        state.id === betweenId ? { ...state, isOpen: true } : state
      )
    );
  }, [betweenId, hasImage, setBetweenEditorState, setIsText]);

  const onClose = useCallback(
    (isCancel: boolean) => {
      setIsEditorOpen(false);
      if (isCancel) {
        reset();
      } else {
        router.refresh();
      }

      setBetweenEditorState?.((prev) =>
        prev.map((state) =>
          state.id === betweenId ? { ...state, isOpen: false } : state
        )
      );
    },
    [betweenId, reset, router, setBetweenEditorState]
  );

  const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    setIsLoading(true);
    //targetにはlabel属性はないのでname属性を使う
    if (event?.target?.name === "private") {
      data.isPrivate = true;
    }
    if (event?.target?.name === "public") {
      data.isPrivate = false;
    }

    let request;

    if (between) {
      request = () => axios.post(`../api/between/${betweenId}`, data);
    } else {
      request = () => axios.post(`../api/between`, data);
    }

    await request()
      .then(() => {
        if (data.isPrivate) {
          toast.success("下書きが保存されました");
        } else {
          toast.success("公開されました");
        }
        onClose(false);
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {between && !isEditorOpen && (
        <section
          className={`flex flex-col w-full h-auto items-start justify-start font-semibold text-yt-white   py-3 px-2 rounded-xl mb-3 cursor-pointer bg-yt-component border-2 border-yt-atom`}
        >
          <div className="w-full text-[13px]  text-indigo-200/80 pl-8">
            よまれた行間
          </div>
          {hasImage ? (
            <>
              <BetweenImageList
                viewOnly
                images={between?.uploadedImages}
                betweenId={between?.id}
              />
            </>
          ) : (
            <Preview value={between?.content as string} />
          )}

          <div className="  w-full flex flex-row justify-end items-center pr-2 mt-2">
            {between.isPrivate && (
              <div className="mr-2">
                <PrivateIcon />
              </div>
            )}
            {between?.user?.deletedAt ? (
              <div className="group flex flex-col pr-3 cursor-pointer  w-auto">
                <div className="text-indigo-300 hover:text-indigo-400 font-semibold">
                  Readine
                </div>

                <div className="hidden h-0 w-0 group-hover:inline-block overflow-visible ">
                  <div className="w-[150px] h-auto px-2 py-1 rounded-md bg-yt-atom text-xs">
                    Unsubscribed User
                  </div>
                </div>
              </div>
            ) : (
              <Link
                className="pr-3 cursor-pointer text-indigo-300 hover:text-indigo-400 font-semibold"
                href={`/writer/${between?.user?.id}`}
              >
                {between?.user?.name}
              </Link>
            )}

            {between.user &&
              !between?.user?.deletedAt &&
              currentUser?.id !== between.user?.id && (
                <ThanksButton
                  destinationUser={between.user}
                  loggedIn={currentUser ? true : false}
                />
              )}
            <div className="w-auto font-light text-yt-text-gray text-sm  flex flex-row items-center">
              <div>{dayjs(between.updatedAt).format("YYYY/M/D")}</div>
              {isEdited && <div className="ml-2 text-[13px]">編集済</div>}
            </div>
            {currentUser?.id === between.user?.id && !isEditorOpen && (
              <div className="w-auto ml-2">
                <MdCreate
                  size={22}
                  className="cursor-pointer hover:text-readine-green"
                  onClick={onOpen}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {isEditorOpen && (
        <>
          <AskGpt />
          <InputBox
            id="between"
            setValue={setValue}
            getValues={getValues}
            height={250}
            errors={errors}
            labelTop={labelTop}
            between={between}
            isMathJax={isMathJax}
          />

          <div className="w-full flex flex-row justify-end items-center gap-x-3 pb-3 pr-2">
            <div className="inline-block w-[65px] ">
              <Button
                label="キャンセル"
                name="cancel"
                onClick={() => onClose(true)}
                small
                transparent
              />
            </div>
            <div className="inline-block w-[65px] ">
              <Button
                label="下書き"
                name="private"
                onClick={handleSubmit((data, event) => onSubmit(data, event))}
                small
              />
            </div>
            <div className="inline-block w-[65px] ml-2">
              <Button
                label="公開"
                name="public"
                onClick={handleSubmit((data, event) => onSubmit(data, event))}
                small
                outline
              />
            </div>
            <div className="w-fit h-fit text-yt-white hover:opacity-80 cursor-pointer">
              <MdDelete
                size={24}
                name="delete"
                onClick={() => deleteModal.onOpen("between", between?.id)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BetweenCard;
