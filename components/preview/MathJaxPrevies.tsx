"use client";
import { MathJax } from "better-react-mathjax";

interface MathJaxPreviewProps {
  value: string;
  height?: number;
}

const MathJaxPreview: React.FC<MathJaxPreviewProps> = ({ value, height }) => {
  return (
    <article className="w-full h-auto flex flex-row justify-center text-[14px] font-normal ">
      <div className="w-[100%]">
        <MathJax>
          {/* MathJaxContext is put on the layout.tsx as wrapper */}
          <div
            className={`w-full  bg-yt-component px-5 py-3 rounded-[15px] resize-y overflow-y-auto font-light leading-7`}
            style={{ height: height ? height : "auto" }}
            dangerouslySetInnerHTML={{ __html: value as string }}
          />
        </MathJax>
      </div>
    </article>
  );
};

export default MathJaxPreview;
