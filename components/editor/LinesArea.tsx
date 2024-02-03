"use client";
import {
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import InputBox from "./InputBox";
import { Interest } from "@prisma/client";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import InterestArea from "./InterestArea";
import PageArea from "./PageArea";
import useWindowSize from "@/hooks/useWindowSize";
import AskGpt from "../AskGpt";

interface LinesAreaProps {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  watch?: UseFormWatch<FieldValues>;
  originalInterests: Interest[] | null;
  existingLinesInterests?: string[];
  errors: FieldErrors;
}
const LinesArea: React.FC<LinesAreaProps> = ({
  register,
  setValue,
  getValues,
  watch,
  originalInterests,
  existingLinesInterests,
  errors,
}) => {
  const { isMedium } = useWindowSize();
  return (
    <>
      <AskGpt />
      <div className="flex flex-row justify-between items-bottom">
        <div className="w-wuto">
          <PageArea
            id="pageBefore"
            register={register}
            setValue={setValue}
            errors={errors}
            required
            watch={watch}
          />
        </div>
        <Link
          href="/markdown_example"
          target="_blank"
          className="w-auto h-auto text-readine-green text-sm flex items-end justify-end pr-3 hover:text-yt-white cursor-pointer"
        >
          <div className="mr-2"> Markdown Notation Example</div>
          <FiExternalLink size={18} className="pb-0" />
        </Link>
      </div>

      <InputBox
        id="lineBefore"
        setValue={setValue}
        getValues={getValues}
        labelTop="よみたい行間"
        labelBottom="…と、"
        errors={errors}
        height={isMedium ? 200 : undefined}
      />
      <div>
        <PageArea
          id="pageAfter"
          register={register}
          setValue={setValue}
          errors={errors}
          required
          watch={watch}
        />
      </div>
      <InputBox
        id="lineAfter"
        setValue={setValue}
        getValues={getValues}
        labelBottom="…とのあいだの行間"
        errors={errors}
        height={isMedium ? 200 : undefined}
      />
      <div className="w-full pl-3 mt-5 -mb-2 font-semibold text-readine-green">
        よみたい動機
      </div>
      <InputBox
        id="motivation"
        setValue={setValue}
        getValues={getValues}
        labelTop="よみたい動機"
        height={isMedium ? 300 : 200}
        errors={errors}
      />
      <InterestArea
        id="interests"
        setValue={setValue}
        originalInterests={originalInterests}
        existingLinesInterests={existingLinesInterests}
      />
    </>
  );
};

export default LinesArea;
