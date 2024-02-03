"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// const mdKaTeX = `This is to display the
// \`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
//  in one line

// \`\`\`KaTeX
// c = \\pm\\sqrt{a^2 + b^2}
// \`\`\`
// `;

interface MathEditorProps {
  value: string;
  height?: number;
}

const MathEditorPreview: React.FC<MathEditorProps> = ({ value, height }) => {
  return (
    <article className="w-full h-auto " data-color-mode="dark">
      <MDEditor
        preview="preview"
        hideToolbar={true}
        height={height && height}
        value={value}
        visibleDragbar={true}
        style={{
          border: "1px solid #282828",
          outline: "1px solid #282828",
          borderRadius: "15px",
          backgroundColor: "#282828", //box全体のbg.テキスト周囲はglobal.cssに記載
          //fontSizeその他はglobal.cssで調整
          // zIndex: 0,設定する必要がある→modalがpage.tsxより上位に置かれてない可能性
        }}
        previewOptions={{
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
                    style={{ fontSize: "150%" }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              }
              return <code className={String(className)}>{txt}</code>;
            },
          },
        }}
      />
    </article>
  );
};

export default MathEditorPreview;
