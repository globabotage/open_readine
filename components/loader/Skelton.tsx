"use client";

import ContentLoader from "react-content-loader";

interface SkeltonProps {
  scale?: number;
}
const Skelton: React.FC<SkeltonProps> = ({ scale }) => {
  return (
    <ContentLoader
      speed={1}
      width={"100%"}
      height={"100%"}
      viewBox="0 0 700 1200"
      backgroundColor="rgb(13,17,23,0.4)"
      foregroundColor="rgb(5,46,22,0.4)" //green-950:rgb(5,46,22);#052e16
      //
      //tailwind:https://tailwindcss.com/docs/customizing-colors
    >
      <rect x="10" y="0" rx="10" ry="10" width="690" height="280" />
      <rect x="10" y="300" rx="10" ry="10" width="690" height="280" />
      <rect x="10" y="600" rx="10" ry="10" width="690" height="280" />
      <rect x="10" y="900" rx="10" ry="10" width="690" height="280" />
    </ContentLoader>
  );
};

export default Skelton;
