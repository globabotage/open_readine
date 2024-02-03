"use client";
import { use, useEffect, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface PageAreaProps {
  id: string;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  required?: boolean;
  errors: FieldErrors;
  watch?: UseFormWatch<FieldValues>;
}

const PageArea: React.FC<PageAreaProps> = ({
  id,
  register,
  required,
  errors,
}) => {
  const hasMaxLengthError = errors[id]?.type === "maxLength";
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full pt-3 pl-3 relative">
        <input
          className={`peer bg-react-md-editor-dark p-2 rounded-lg w-20 transition pt-5  outlinle-none
        ${
          errors[id]
            ? " border-2 border-rose-500"
            : "border-[0.5px] border-yt-atom"
        }
        
        `}
          type="text"
          id={id}
          placeholder=" "
          {...register(id, { required, maxLength: 10 })}
        />
        <label
          className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-5 z-10 origin-[0] peer-placeholder-shown:scale-90 peer-placeholder-shown:translate-y-0  peer-focus:scale-75 peer-focus:-translate-y-4 
        ${errors[id] ? "text-rose-500" : "text-yt-white"}
     
        `}
        >
          page
        </label>
      </div>
      {hasMaxLengthError && (
        <div className="text-rose-500 text-xs ">最大10字</div>
      )}
    </div>
  );
};

export default PageArea;
