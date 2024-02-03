"use client";

import AskGpt from "@/components/AskGpt";
import MathEditor from "@/components/editor/MathEditor";
import { useEffect, useState } from "react";

interface ClientWrapperProps {
  katexExample: string | null;
}
const ClientWrapper: React.FC<ClientWrapperProps> = ({ katexExample }) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (!katexExample) return;
    setValue(katexExample);
  }, [katexExample]);
  return (
    <div className="w-full h-aout max-h-screen" data-color-mode="dark">
      <AskGpt />
      <div className="w-full text-right text-sm mt-5 ">
        See also;&nbsp;
        <a
          href="https://katex.org/docs/supported.html"
          className="underline text-indigo-300 font-semibold hover:text-indigo-200"
        >
          KaTeX&apos;s Supported Functions
        </a>
      </div>
      <div className="pb-36">
        <MathEditor
          mdEditorValue={value}
          setMdEditorValue={setValue}
          height={600}
          live
        />
      </div>
    </div>
  );
};

export default ClientWrapper;
