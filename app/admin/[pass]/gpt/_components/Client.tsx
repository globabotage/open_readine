"use client";

import MathEditor from "@/components/editor/MathEditor";
import { Prompts } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  prompts: Prompts[] | null;
}
const Client: React.FC<Props> = ({ prompts }) => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const [newPrompt, setNewPrompt] = useState<{
    id: string | null;
    title: string;
    prompt: string;
  }>({
    id: null,
    title: "",
    prompt: "",
  });

  const [returnData, setReturnData] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const clickCreate = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("test_prompt");
    }
    setSelectedId(null);
    setNewPrompt({ id: null, title: "", prompt: "" });
  };
  const clickHandler = async () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("test_prompt", newPrompt.prompt);
    }
    const res = await axios.post("/api/admin/gpt/check_prompt", {
      value,
      promptValue: prompt,
    });
    setReturnData(res.data);
  };

  const saveHandler = async (isDelete: boolean) => {
    axios
      .post("/api/admin/gpt/save_prompt", { newPrompt, isDelete })
      .then(() => {
        router.refresh();
        if (isDelete) {
          setNewPrompt({ id: null, title: "", prompt: "" });
        }
      });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prompt = localStorage.getItem("test_prompt");
      if (prompt) {
        setNewPrompt({ ...newPrompt, prompt });
      }
    }
  }, []);

  const titleClass =
    " rounded-md w-3/4 h-auto py-2 px-3 hover:opacity-80 cursor-pointer";

  return (
    <div className="w-full h-auto max-h-screen  overflow-y-auto text-sm flex flex-row justify-between">
      <div className="w-1/4 h-[120px] flex flex-col pl-2 items-center gap-2 mt-5">
        <div className={`${titleClass} bg-yt-atom`} onClick={clickCreate}>
          Create New
        </div>
        {prompts &&
          prompts.map((p) => (
            <div
              key={p.id}
              className={`${titleClass} ${
                selectedId === p.id ? "bg-green-500" : "bg-yt-component"
              }`}
              onClick={() => {
                setNewPrompt(p);
                setSelectedId(p.id);
              }}
            >
              {p.title}
            </div>
          ))}
      </div>
      <div className="w-3/4 h-auto flex flex-col items-center justify-center gap-2 pr-4 pb-24 overflow-y-auto">
        <div className="w-full pt-12">
          <p className="text-green-500 font-semibold">Title</p>
          <input
            className="w-full bg-yt-component text-yt-white rounded-md h-[50px] p-2"
            value={newPrompt.title}
            onChange={(e) =>
              setNewPrompt({ ...newPrompt, title: e.target.value })
            }
          />
          <p className="text-green-500 font-semibold">Prompt</p>
          <textarea
            className="w-full bg-yt-component text-yt-white rounded-md h-[250px] p-2 "
            value={newPrompt.prompt}
            onChange={(e) =>
              setNewPrompt({ ...newPrompt, prompt: e.target.value })
            }
          />
        </div>
        <div className="w-full">
          <p className="text-rose-500 font-semibold">Text written by a user</p>
          <textarea
            className="w-full bg-yt-component text-yt-white rounded-md h-[50px] p-2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="w-full text-right space-x-2">
          <button
            className=" bg-green-500 hover:bg-green-500/80 text-white font-bold py-2 px-4 rounded"
            onClick={clickHandler}
          >
            テスト
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => saveHandler(false)}
          >
            {!newPrompt.id ? "保存" : "更新"}
          </button>
          {newPrompt.id && (
            <button
              className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => saveHandler(true)}
            >
              削除
            </button>
          )}
        </div>
        <div
          className="mt-5 w-full h-auto  text-yt-white"
          data-color-mode="dark"
        >
          <MathEditor
            mdEditorValue={returnData}
            setMdEditorValue={setReturnData}
            placeholder="ここに結果が表示されます"
            live={true}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Client;
