"use client";
import { Interest } from "@prisma/client";
import { FaLightbulb } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Button from "../Button";
import LinesArea from "../editor/LinesArea";
import useDeleteModal from "@/hooks/modal/useDeleteModal";
import useToggleEditor from "@/hooks/useToggleEditor";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useState, useEffect, useMemo } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { SafeLines } from "@/types";

interface LinesEditorProps {
  lines: SafeLines;
  interestArray: Interest[];
}

const LinesEditor: React.FC<LinesEditorProps> = ({ lines, interestArray }) => {
  const { setLinesOpen } = useToggleEditor();

  const router = useRouter();

  const deleteModal = useDeleteModal();

  const [filteredInterestArray, setFilteredInterestArray] = useState<
    Interest[]
  >([]);

  useEffect(() => {
    let filteredInterests: Interest[] = [];
    if (interestArray) {
      const interestIdsSet = new Set(lines.interestIds);
      filteredInterests = interestArray?.filter((interest) =>
        interestIdsSet.has(interest.id)
      );
    }
    setFilteredInterestArray(filteredInterests);
  }, [interestArray, lines]);

  const filteredInterestNames: string[] = useMemo(() => {
    return filteredInterestArray.map((interest) => interest.name);
  }, [filteredInterestArray]);

  const hasPublicBetween = useMemo(() => {
    return lines?.betweens?.some((between) => between.isPrivate === false);
  }, [lines?.betweens]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      bookId: lines?.book?.id,
      pageBefore: lines?.pageBefore,
      pageAfter: lines?.pageAfter,
      lineBefore: lines?.lineBefore,
      lineAfter: lines?.lineAfter,
      motivation: lines?.motivation,
      interests: filteredInterestNames,
      isPrivate: false,
    },
  });

  useEffect(() => {
    setValue("bookId", lines?.book?.id);
    setValue("pageBefore", lines?.pageBefore);
    setValue("pageAfter", lines?.pageAfter);
    setValue("lineBefore", lines?.lineBefore);
    setValue("lineAfter", lines?.lineAfter);
    setValue("motivation", lines?.motivation);
    setValue("interests", filteredInterestNames);
    setValue("isPrivate", false);
  }, [lines, filteredInterestNames, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
    //targetにはlabel属性はないのでname属性を使う
    if (event?.target?.name === "private") {
      data.isPrivate = true;
    }
    if (event?.target?.name === "public") {
      data.isPrivate = false;
    }

    //escape
    data.pageBefore = data.pageBefore.replace(/</g, "&lt;");
    data.pageAfter = data.pageAfter
      ? data.pageAfter.replace(/</g, "&lt;")
      : null;

    await axios
      .post(`../api/read/${lines?.id}`, data)
      .then(() => {
        if (data.isPrivate) {
          toast.success("下書きが保存されました");
          router.refresh();
          // reset();
        } else {
          toast.success("公開されました");
          router.refresh();
          // reset();
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setLinesOpen(false);
      });
  };
  return (
    <>
      <>
        <div className="w-auto h-auto mb-5">
          <LinesArea
            register={register}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            existingLinesInterests={filteredInterestNames}
            originalInterests={interestArray as Interest[]}
            errors={errors}
          />
        </div>
        <div className="w-full flex flex-row justify-end items-center mb-5 gap-x-3 pr-2">
          <div className="inline-block w-[65px] ">
            <Button
              label="キャンセル"
              name="cancel"
              onClick={() => {
                setLinesOpen(false);
                reset();
              }}
              transparent
              small
            />
          </div>
          <div className="inline-block w-[65px] ">
            <Button
              label={!hasPublicBetween ? "公開" : "更新"}
              name="public"
              onClick={handleSubmit((data, event) => onSubmit(data, event))}
              small
              outline
            />
          </div>
          {!hasPublicBetween && (
            <>
              <div className="inline-block w-[65px] mr-10">
                <Button
                  label="下書き"
                  name="private"
                  onClick={handleSubmit((data, event) => onSubmit(data, event))}
                  small
                />
              </div>

              <div className="w-fit h-fit text-yt-white hover:opacity-80 cursor-pointer">
                <MdDelete
                  size={24}
                  name="delete"
                  onClick={() => deleteModal.onOpen("lines", lines?.id)}
                />
              </div>
            </>
          )}
        </div>
        {hasPublicBetween && (
          <div className="w-full flex flex-row justify-end items-center pr-2 mb-10 text-sm text-indigo-200">
            <FaLightbulb className="mr-1 text-yellow-400" />
            すでに行間がよまれている投稿は非公開化や削除はできません。
          </div>
        )}
      </>
    </>
  );
};

export default LinesEditor;
