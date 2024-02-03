"use client";

import ContentLoader from "react-content-loader";

const SkeltonSide = () => {
  //If you like to test, use "_loadingtest" directry as a page directry.
  const width = 100; //wrapper's min length is 350px
  const headHeight = 35;
  const bodyHeight = 65;
  const margin = 7;
  const radius = width * 0.05;

  return (
    <ContentLoader
      speed={1}
      width={"100%"}
      height={"100%"}
      viewBox="0 0 100 300" //Height is determined by the ratio for the width.And what matter is whether the height and width cover the whole area of the SVG.
      //To make the size of the loader responsive, you can set the viewBox attribute to cover the full width and height of the SVG.
      style={{ width: "100%", height: "auto" }} //Important
      backgroundColor="rgb(13,17,23,0.7)"
      foregroundColor="rgb(5,46,22,0.7)" //green-950:rgb(5,46,22);#052e16
      //
      //tailwind:https://tailwindcss.com/docs/customizing-colors
    >
      <rect
        x={width * 0.025}
        y="0"
        rx={radius}
        ry={radius}
        width={width * 0.95}
        height={headHeight}
      />
      <rect
        x={width * 0.025}
        y={headHeight + margin}
        rx={radius}
        ry={radius}
        width={width * 0.95}
        height={bodyHeight}
      />
      <rect
        x={width * 0.025}
        y={headHeight + bodyHeight + margin * 2}
        rx={radius}
        ry={radius}
        width={width * 0.95}
        height={bodyHeight}
      />
      <rect
        x={width * 0.025}
        y={headHeight + bodyHeight * 2 + margin * 3}
        rx={radius}
        ry={radius}
        width={width * 0.95}
        height={bodyHeight}
      />
    </ContentLoader>
  );
};

export default SkeltonSide;
