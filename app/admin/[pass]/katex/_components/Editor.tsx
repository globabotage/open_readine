"use client";

import MathEditor from "@/components/editor/MathEditor";
import axios from "axios";
import { useEffect, useState } from "react";

interface EditorProps {
  example: string | null;
}
const Editor: React.FC<EditorProps> = ({ example }) => {
  const [mdEditorValue, setMdEditorValue] = useState<string>(
    example ? example : ""
  );
  const clickHandler = async () => {
    const res = await axios.post("/api/admin/katex", {
      katexExample: mdEditorValue,
    });
  };

  useEffect(() => {
    if (!example) return;
    setMdEditorValue(example);
  }, [example]);

  return (
    <div className="w-full h-auto max-h-screen flex flex-col items-center gap-4  mt-7">
      <div className="w-3/4 " data-color-mode="dark">
        <MathEditor
          mdEditorValue={mdEditorValue}
          setMdEditorValue={setMdEditorValue}
          height={600}
        />
      </div>

      <button
        className="w-1/3 px-2 py-1 bg-blue-500 rounded-md hover:bg-blue-400"
        onClick={clickHandler}
      >
        更新
      </button>
    </div>
  );
};

export default Editor;
