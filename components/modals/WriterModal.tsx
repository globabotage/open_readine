"use client";

import Modal from "./Modal";
import { useRouter } from "next/navigation";
import useWriterModal from "@/hooks/writer/useWriterModal";
import useToggleWriterEditor from "@/hooks/writer/useToggleWriterEditor";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Button from "../Button";
import { IoSettingsSharp } from "react-icons/io5";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

interface WriterModalProps {
  writer: User | null;
  isCurrentUser: boolean;
}

const WriterModal: React.FC<WriterModalProps> = ({ isCurrentUser, writer }) => {
  const router = useRouter();
  const writerModal = useWriterModal();
  const toggleWriterEditor = useToggleWriterEditor();
  const [nameUnique, setNameUnique] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: writer?.name,
      detail: writer?.detail,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (/^[\n\s　]*$/.test(data.detail)) {
      //改行・半スペ、全スペのいずれかのみで構成されている場合は空文字に
      data.detail = "";
    }
    //改行が3回「以上」繰り返されている箇所を、改行2回へ置換
    data.detail = data.detail.replace(/\n{3,}/g, "\n\n");

    await axios
      .post(`../api/writer`, data)
      .then(() => {
        toast.success("更新されました");
        router.refresh();
        toggleWriterEditor.setOpen(false);
        reset({
          name: data.name,
          detail: data.detail,
          //if simply using reset(), the values will be initialized to the defaultValues which was set when the page was first loaded
        });
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const closeModal = () => {
    writerModal.onClose();
    toggleWriterEditor.setOpen(false);
    reset();
  };

  const name = watch("name");

  useEffect(() => {
    const checkNameDuplicated = async () => {
      if (!name) return;

      const res = await axios.post(`/api/auth/check_duplication`, {
        type: "change_name",
        value: name,
      });
      if (res.data === "Duplicated") {
        // toast.error("このメールアドレスはすでに使用されています。");
        setNameUnique(false);
        setError("name", {
          type: "name_duplicated",
          message: "This name is already in use.",
        });
        return;
      }
      clearErrors("name");
      setNameUnique(true);
    };

    checkNameDuplicated();
  }, [clearErrors, name, setError]);

  let bodyContent = (
    <div className="w-full flex flex-col space-y-2 relative ">
      <div className="w-full flex flex-row justify-center ">
        <div className="basis-1/5" />
        <div className="basis-3/5 text-center font-semibold text-readine-green">
          {writer?.name}
        </div>
        <div className="basis-1/5 flex justify-end">
          {isCurrentUser && (
            <IoSettingsSharp
              size={22}
              className="cursor-pointer text-readine-green hover:text-yt-white"
              onClick={() => {
                toggleWriterEditor.setOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <div
        className="w-full h-auto whitespace-pre-wrap break-words break-all"
        dangerouslySetInnerHTML={{
          __html: writer?.detail ? writer.detail : "",
        }}
      />
    </div>
  );

  if (toggleWriterEditor.isOpen) {
    bodyContent = (
      <div className="w-full flex flex-col items-center  relative ">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="col-span-1  ">
            <input
              type="text"
              className={`w-full bg-yt-component px-2 py-1 rounded-md
              ${errors.name ? "text-rose-500" : "text-yt-white"}
            `}
              id="name"
              {...register("name", { required: true, maxLength: 20 })}
            />
          </div>
          {errors.name && (
            <div className="col-span-1  pl-3 text-rose-500">
              {errors.name.message as string}
            </div>
          )}{" "}
        </div>
        <div className="w-full mt-3">
          <textarea
            className="text-yt-white w-full h-36 bg-yt-component px-2 py-1 rounded-md"
            id="detail"
            {...register("detail", { required: false, maxLength: 1000 })}
            maxLength={1001}
          />
        </div>

        <div className="w-full text-right pr-2 text-rose-500 h-8 text-sm">
          {errors.detail &&
            errors.detail.type === "maxLength" &&
            "1000文字以内で入力してください"}
        </div>
        <div className="w-1/2 ">
          <Button
            label={"更新"}
            name="public"
            onClick={handleSubmit((data) => onSubmit(data))}
            small
            outline
            disabled={!nameUnique}
          />
        </div>
        <div className="w-1/2 mt-3">
          <Button
            label={"キャンセル"}
            name="public"
            onClick={() => {
              toggleWriterEditor.setOpen(false);
              reset();
            }}
            small
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={writerModal.isOpen}
      onClose={closeModal}
      onSubmit={() => {}}
      body={bodyContent}
      shortHeight
    />
  );
};

export default WriterModal;
