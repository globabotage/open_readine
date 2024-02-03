"use client";

import { Interest } from "@prisma/client";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

interface InterestAreaProps {
  id: string;
  originalInterests: Interest[] | null;
  setValue: UseFormSetValue<FieldValues>;
  existingLinesInterests?: string[];
}
const InterestArea: React.FC<InterestAreaProps> = ({
  id,
  originalInterests,
  setValue,
  existingLinesInterests,
}) => {
  const input = useRef<HTMLInputElement>(null);
  const [initialState, setInitialState] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newInterests, setNewInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [errorSymbol, setErrorSymbol] = useState(false);
  const [isFuLL, setIsFull] = useState(false);

  const suggestions = useMemo(() => {
    if (!inputValue) return [];

    const filteredOrigins = originalInterests?.filter(
      (interest) =>
        !newInterests.includes(interest.name) &&
        interest.name.includes(inputValue)
    );

    const filteredNews = newInterests.find(
      (interest) => interest === inputValue
    );

    if (!filteredOrigins?.length && !filteredNews) {
      return [{ name: inputValue }];
    }

    return [{ name: inputValue }, ...(filteredOrigins as Interest[])];
  }, [inputValue, newInterests, originalInterests]);

  useEffect(() => {
    if (existingLinesInterests && existingLinesInterests.length > 0) {
      setNewInterests(existingLinesInterests);
    }
  }, [existingLinesInterests]);

  useEffect(() => {
    setInitialState(true);
  }, [suggestions]);

  useEffect(() => {
    setValue(id, newInterests);
  }, [id, newInterests, setValue]);

  const onMouseHandler = (index: number) => {
    if (initialState) {
      setInitialState(false);
    }
    setSelectedIndex(index);
  };

  const updateInterests = (name: string, action: "add" | "remove") => {
    setNewInterests((prevInterests) =>
      action === "add"
        ? [...prevInterests, name]
        : prevInterests.filter((interest) => interest !== name)
    );
    input.current?.focus();
    setInputValue("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\u3000]/;

    if (regex.test(e.target.value)) {
      setErrorSymbol(true);
      return;
    }

    setInputValue(e.target.value);
    setErrorSymbol(false);
  };

  useEffect(() => {
    if (newInterests.length === 5) {
      setIsFull(true);
    } else {
      setIsFull(false);
    }
  }, [newInterests]);

  return (
    <div className="flex flex-col items-start justify-center p-2 ">
      <div className="pl-1 font-semibold text-readine-green">
        関心
        <span className="ml-3 text-[13px] text-yt-text-gray font-light">
          最大5つ
        </span>
        <span></span>
      </div>
      {errorSymbol && (
        <div className="text-sm text-rose-500 h-auto pb-1 pl-1">
          記号・スペースは使用できません。
        </div>
      )}
      <div
        className="flex flex-row flex-wrap w-full  h-auto justify-start items-center p-3 bg-react-md-editor-dark border-[1px] border-yt-atom rounded-lg"
        onClick={() => input.current?.focus()}
      >
        <div className="w-auto flex flex-row flex-wraxp ">
          {newInterests.map((interest, index) => (
            <div
              className="w-fit flex flex-row items-center justify-center bg-green-600 p-2 rounded-lg mr-2 hover:bg-green-400 mb-2"
              key={index}
            >
              <div>{interest}</div>
              <button onClick={() => updateInterests(interest, "remove")}>
                {" "}
                <IoMdClose size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="relative w-auto overflow-visible ml-3">
          <div>
            <input
              id={id}
              value={inputValue}
              onChange={handleChange}
              ref={input}
              className="w-auto bg-transparent outline-none cursor-auto  "
              type="text"
              autoComplete="off"
              maxLength={30}
              disabled={isFuLL}
            />
          </div>

          <div className="absolute top-10 w-full h-auto max-h-[200px] overflow-y-auto  bg-yt-component rounded-b-lg cursor-pointer z-30 ">
            {suggestions?.map((sujest, index) => (
              <div
                className={`p-2  hover:bg-green-600 rounded-md transform duration-150
                ${
                  (index === 0 && initialState) ||
                  (index === selectedIndex && !initialState)
                    ? "bg-green-600"
                    : "bg-transparent"
                }
     
              
              `}
                key={index}
                onMouseEnter={() => onMouseHandler(index)}
                onClick={() => updateInterests(sujest.name, "add")}
              >
                {sujest.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestArea;
