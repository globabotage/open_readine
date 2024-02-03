"use client";
import {
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import MathEditor from "./MathEditor";
import { useEffect, useState } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import useToggleBetween from "@/hooks/useToggleBetween";
import useUploadImageModal from "@/hooks/modal/useUploadImageModal";
import Link from "next/link";
import { FiAlertTriangle, FiExternalLink } from "react-icons/fi";
import BetweenImageList from "../Between/BetweenImageList";
import { SafeBetween } from "@/types";

interface InputBoxProps {
  id: string;
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  errors: FieldErrors;

  labelTop?: string | React.ReactElement;
  labelBottom?: string;
  height?: number;
  placeholder?: string;
  between?: SafeBetween;
  isMathJax?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({
  id,
  setValue,
  getValues,
  labelTop,
  labelBottom,
  height,
  placeholder,
  errors,
  between,
  isMathJax,
}) => {
  const defaultValues = getValues ? getValues(id) : "";
  const [mdEditorValue, setMdEditorValue] = useState<string>(defaultValues);
  const uploadImageModal = useUploadImageModal();
  useEffect(() => {
    setValue(id, mdEditorValue);
  }, [id, mdEditorValue, setValue]);

  const { isText, setIsText } = useToggleBetween();
  const isBetweenArea = id === "between";

  useEffect(() => {
    if (between && between.content && isBetweenArea) {
      setIsText(true);
    }
  }, [isBetweenArea, setIsText, between]);

  return (
    <>
      {isBetweenArea && (
        <>
          <div
            className={`w-full font-semibold mt-4
          ${errors[id] ? "text-rose-500" : "text-readine-green"}`}
          >
            {labelTop}
          </div>
          <div className="w-full flex flex-row items-center justify-start text-sm font-light mt-5 mb-1 pl-5">
            <div className="w-auto h-auto mr-3 text-yt-white flex items-center">
              <AiOutlineArrowDown size={20} />
              <div>「行間」の投稿形式</div>
            </div>
            <div className="w-auto h-auto flex flex-row items-center cursor-pointer">
              <div
                className={`w-20 h-auto py-0.5 rounded-l-xl text-center ${
                  !isText
                    ? "bg-readine-green/60 hover:bg-readine-green/80"
                    : "bg-yt-component hover:bg-yt-atom"
                }`}
                onClick={() => uploadImageModal.onOpen()}
              >
                画像
              </div>
              <div
                className={`w-20 h-auto py-0.5 rounded-r-xl text-center ${
                  isText
                    ? "bg-readine-green/60 hover:bg-readine-green/80"
                    : "bg-yt-component hover:bg-yt-atom"
                }`}
                onClick={() => uploadImageModal.onOpen()}
              >
                テキスト
              </div>
            </div>
          </div>
        </>
      )}

      {(!isBetweenArea || isText) && (
        <div className="flex flex-col items-start justify-center  mb-2 w-full ">
          <div className="w-full  py-2 px-3" data-color-mode="dark">
            <MathEditor
              mdEditorValue={mdEditorValue}
              setMdEditorValue={setMdEditorValue}
              placeholder={placeholder}
              height={height}
            />
          </div>

          <div className="pl-5 text-sm font-light h-auto">{labelBottom}</div>
        </div>
      )}
      {isMathJax && (
        <div className="flex items-center w-full h-auto px-3 py-2 bg-rose-600 text-yt-white mb-5 rounded-xl ">
          <FiAlertTriangle size={20} />
          <div className="text-sm ml-2">
            記述方式がMathJaxからKaTeXに変更されました。公開状態ではMathJaxの表示がサポートされていますが、Editor上ではサポートされていません。
          </div>
        </div>
      )}
      {isBetweenArea && (
        <div className="w-full h-auto flex flex-row justify-end">
          <Link
            href="/markdown_example"
            target="_blank"
            className="w-auto  h-auto text-readine-green text-sm flex items-end justify-end pr-3 hover:text-yt-white cursor-pointer mb-3 -mt-2"
          >
            <div className="mr-2"> Markdown Notation Example</div>
            <FiExternalLink size={18} className="pb-0" />
          </Link>
        </div>
      )}

      {isBetweenArea && !isText && (
        <BetweenImageList
          setValue={setValue}
          images={between?.uploadedImages}
          betweenId={between?.id}
        />
      )}
    </>
  );
};

export default InputBox;
