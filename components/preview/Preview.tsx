"use client";
import { useMemo } from "react";
import MathEditorPreview from "./MathEditorPreview";
import MathJaxPreview from "./MathJaxPrevies";

interface PreviewProps {
  value: string;
  height?: number;
}

const Preview: React.FC<PreviewProps> = ({ value, height }) => {
  const isMathJax = useMemo(() => {
    if (value?.includes("math-tex")) {
      return true;
    }
    return false;
  }, [value]);
  return (
    <>
      {isMathJax ? (
        <MathJaxPreview value={value} height={height} />
      ) : (
        <MathEditorPreview value={value} height={height} />
      )}
    </>
  );
};

export default Preview;
