"use client";

import { MathJaxContext } from "better-react-mathjax";
import dynamic from "next/dynamic";

const Wrapper = dynamic(() => Promise.resolve(MathJaxContext), {
  ssr: false,
});

interface MathJaxWrapperProps {
  children: React.ReactNode;
}

const MathJaxWrapper: React.FC<MathJaxWrapperProps> = ({ children }) => {
  //Also manual MathJax trigger is put on LinesList.tsx. If it's not put, formulas won't be rendered when the query is changed.
  //If you use MathJaxContext directry ( not through dynamic), the error message will be shown on browser.
  return <Wrapper>{children}</Wrapper>;
};

export default MathJaxWrapper;
