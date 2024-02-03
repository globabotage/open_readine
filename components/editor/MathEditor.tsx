"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import { PreviewType } from "@uiw/react-md-editor";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const mdKaTeX = `This is to display the 
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
`;

interface MathEditorProps {
  mdEditorValue: string;
  setMdEditorValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  height?: number;
  live?: boolean;
}

const MathEditor: React.FC<MathEditorProps> = ({
  mdEditorValue,
  setMdEditorValue,
  placeholder,
  height,
  live,
}) => {
  const [previewMode, setPreviewMode] = useState<PreviewType>("preview");
  const [hideToolbar, setHideToolbar] = useState<boolean>(true);
  return (
    <div
      className="cursor-auto"
      onClick={() => {
        setPreviewMode("live");
        setHideToolbar(false);
      }}
    >
      <MDEditor
        preview={!live ? previewMode : "live"}
        hideToolbar={!live ? hideToolbar : false}
        height={height ? height : 80}
        value={mdEditorValue}
        onChange={(value) => setMdEditorValue(value as string)}
        textareaProps={{
          placeholder: placeholder,
        }}
        style={{
          border: "1px solid #606060",
        }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]], //against XSS
          components: {
            code: ({ inline, children = [], className, ...props }) => {
              const txt = children[0] || "";
              if (inline) {
                if (typeof txt === "string" && /^\$\$(.*)\$\$/.test(txt)) {
                  const html = katex.renderToString(
                    txt.replace(/^\$\$(.*)\$\$/, "$1"),
                    {
                      throwOnError: false,
                    }
                  );
                  return <code dangerouslySetInnerHTML={{ __html: html }} />;
                }
                return <code>{txt}</code>;
              }
              const code =
                props.node && props.node.children
                  ? getCodeString(props.node.children as any)
                  : txt;
              if (
                typeof code === "string" &&
                typeof className === "string" &&
                /^language-katex/.test(className.toLocaleLowerCase())
              ) {
                const html = katex.renderToString(code, {
                  throwOnError: false,
                });
                return (
                  <code
                    style={{ fontSize: "100%" }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              }
              return <code className={String(className)}>{txt}</code>;
            },
          },
        }}
      />
    </div>
  );
};

export default MathEditor;
