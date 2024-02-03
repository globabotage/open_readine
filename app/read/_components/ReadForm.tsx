"use client";

import { FieldValues, SubmitHandler, set, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { Interest } from "@prisma/client";
import Button from "@/components/Button";
import { MdArrowBackIosNew } from "react-icons/md";
import IconWrapper from "@/components/IconWrapper";
import LinesArea from "@/components/editor/LinesArea";
import InputBox from "../../../components/editor/InputBox";
import { useEffect, useState } from "react";
import { SafeBook } from "@/types";
import useLoadingPost from "@/hooks/loading/useLoadingPost";
import BookCard from "@/components/Book/BookCard";

interface ReadFormProps {
  originalInterests: Interest[] | null;
}

const ReadForm: React.FC<ReadFormProps> = ({ originalInterests }) => {
  const router = useRouter();
  const [bookdata, setBookdata] = useState<SafeBook>({} as SafeBook);
  const { setIsLoading } = useLoadingPost();
  const { isLoading } = useLoadingPost();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      bookdata: bookdata,
      pageBefore: "",
      lineBefore: "",
      pageAfter: "",
      lineAfter: "",
      motivation: "",
      interests: [],
      between: "",
      isPrivate: false,
      imageUrls: [],
    },
  });

  useEffect(() => {
    let book = null;
    book = localStorage.getItem("book");
    //localStorageを利用する場合、useEffectを用いないと"localStorage is not define"というエラーがデプロイ時に表示される。
    //参考：https://github.com/vercel/next.js/discussions/19911

    if (!book) {
      router.push("/");
    } else {
      setBookdata(JSON.parse(book));
      setValue("bookdata", JSON.parse(book));
    }
  }, [router, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    setIsLoading(true);
    //targetにはlabel属性はないのでname属性を使う
    if (event?.target?.name === "private") {
      data.isPrivate = true;
    }
    if (event?.target?.name === "public") {
      data.isPrivate = false;
    }

    try {
      const res = await axios.post("api/read", data);
      const newLinesId = res.data.id;

      if (data.between !== "" || data.imageUrls.length > 0) {
        await axios.post("api/between", {
          linesId: newLinesId,
          between: data.between,
          imageUrls: data.imageUrls,
          isPrivate: data.isPrivate,
        });
      }

      if (data.isPrivate) {
        toast.success("下書きが保存されました");
      } else {
        toast.success("公開されました");
      }
      const path = "/book/" + res.data.bookId + "?linesId=" + newLinesId;
      router.push(path);
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className=" sticky flex flex-row justify-between items-center top-0 text-right pt-3 pr-3 pb-2 z-30">
        <div className="pl-3">
          <IconWrapper diameter="h-10 w-10" onClick={() => router.back()}>
            <MdArrowBackIosNew />
          </IconWrapper>
        </div>

        <div>
          <div className="inline-block w-[65px] ">
            <Button
              label="下書き"
              name="private"
              onClick={handleSubmit((data, event) => onSubmit(data, event))}
              small
              disabled={isLoading}
            />
          </div>
          <div className="inline-block w-[65px] ml-2">
            <Button
              label="公開"
              name="public"
              onClick={handleSubmit((data, event) => onSubmit(data, event))}
              small
              outline
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center pb-32">
        <div className="w-full md:w-2/3">
          <BookCard bookdata={bookdata} readPage />
          <br />
          <LinesArea
            register={register}
            setValue={setValue}
            getValues={getValues}
            originalInterests={originalInterests}
            errors={errors}
          />

          <InputBox
            id="between"
            setValue={setValue}
            getValues={getValues}
            height={250}
            errors={errors}
            labelTop={
              <div className="w-full flex flex-row items-center">
                <div className="pl-3 w-auto min-w-[50px]">行間</div>

                <div className="text-xs w-auto text-yt-text-gray ml-3">
                  空欄可&nbsp;/&nbsp;空欄の場合「よみたい動機」までが投稿されます
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default ReadForm;
