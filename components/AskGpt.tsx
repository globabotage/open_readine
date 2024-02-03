"use client";

import axios from "axios";
import { useState } from "react";
import MathEditor from "./editor/MathEditor";
import SkeltonGpt from "./loader/SkeltonGpt";
import { IoMdClose } from "react-icons/io";

const AskGpt = () => {
  const [question, setQuestion] = useState<string>("");
  const [gptAnswer, setGptAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = async () => {
    setIsLoading(true);
    const res = await axios.post("/api/gpt/tex", { question });
    if (!res.data) return;
    setGptAnswer(res.data);
    setIsLoading(false);
  };
  return (
    <div className="w-full h-aout mb-3 flex flex-col items-center">
      <div className="flex justify-between w-full bg-yt-component text-yt-white rounded-xl px-3 py-2 mb-5 border-2 border-yt-atom">
        <textarea
          className="w-full bg-yt-bg text-yt-white p-2 "
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask AI to find a TeX command supported by KaTeX."
        />
        <div className="w-auto h-auto flex flex-col justify-end items-center py-1 ml-2">
          <button
            className="w-auto h-auto px-3 py-1  hover:bg-yt-atom rounded-3xl text-sm
              bg-gradient-to-tr from-green-600 to-indigo-600

              hover:from-green-500 hover:to-indigo-500
              disabled:from-green-800 disabled:to-indigo-800

            
            "
            onClick={clickHandler}
            disabled={question === ""}
          >
            Ask
          </button>
        </div>
      </div>
      {isLoading && <SkeltonGpt />}
      {!isLoading && gptAnswer && (
        <div className="w-full px-2" data-color-mode="dark">
          <MathEditor
            mdEditorValue={gptAnswer}
            setMdEditorValue={setGptAnswer}
            height={200}
            live
          />
          <div className="w-full flex justify-end pt-2">
            <IoMdClose
              className="text-yt-white/80 hover:text-yt-white cursor-pointer"
              size={18}
              onClick={() => setGptAnswer("")}
            />
          </div>
          <hr
            className=" bg-gradient-to-r from-green-600/30 to-indigo-600/30 my-2 mb-5 border-none"
            style={{ height: "3px" }}
          />
        </div>
      )}
    </div>
  );
};

export default AskGpt;
