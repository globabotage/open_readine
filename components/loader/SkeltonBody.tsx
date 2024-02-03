"use client";

import ContentLoader from "react-content-loader";

const SkeltonBody = () => {
  //If you like to test, use "_loadingptest" directry as a page directry.

  const width = 100;
  const bookHeight = 5;
  const linesHeight = 25;
  const motiveHeight = 15;
  const betweenHeight = 30;
  const radius = 2;
  const margin = 1;
  return (
    <ContentLoader
      speed={1}
      width={"100%"}
      height={"100%"}
      viewBox={`0 0 100 200`}
      style={{ width: "100%", height: "auto" }} //Important
      backgroundColor="rgb(13,17,23,0.7)"
      foregroundColor="rgb(5,46,22,0.7)" //green-950:rgb(5,46,22);#052e16
      //
      //tailwind:https://tailwindcss.com/docs/customizing-colors
    >
      <rect //book
        x="0"
        y="0"
        rx={radius}
        ry={radius}
        width={width * 0.5}
        height={bookHeight}
      />
      <rect //lines
        x="0"
        y={bookHeight + margin}
        rx={radius}
        ry={radius}
        width={width}
        height={linesHeight}
      />
      <rect //motivation
        x={width * 0.1}
        y={bookHeight + linesHeight + margin * 2}
        rx={radius}
        ry={radius}
        width={width - 10}
        height={motiveHeight}
      />
      <rect //between
        x="0"
        y={bookHeight + linesHeight + motiveHeight + margin * 1.5 * 3}
        rx={radius}
        ry={radius}
        width={width}
        height={betweenHeight}
      />
    </ContentLoader>
  );
};

export default SkeltonBody;
