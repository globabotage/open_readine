"use client";

import {
  Field,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  required,
  register,
  errors,
}) => {
  return (
    <>
      <div className="w-full relative">
        <input
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          type={type}
          className={`peer w-full p-2 pt-5 text-neutral-700 font-light bg-white border-2 rounded-md outlinle-none transition disabled:opacity-70 disabled:cursor-not-allowed

            ${errors[id] ? "border-rose-500" : "border-neutral-300"}
            ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
        />
        <label
          className={`absolute text-md duration-150 transform -translate-y-3 top-4 z-10 origin-[0] 
       left-4
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        ${errors[id] ? "text-rose-500" : "text-zinc-500"}
        `}
        >
          {label}
        </label>
      </div>
      {errors[id] && (
        <div className="w-full text-rose-500 pl-3 -mt-3">
          {errors[id]?.message as string}
        </div>
      )}
    </>
  );
};

export default Input;
