"use client";

import { ScaleLoader } from "react-spinners";
const MiniLoader = () => {
  return (
    // Don't set the position here
    <ScaleLoader width={1} height={17} color="rgb(177,202,178)" margin={1} />
  );
};

export default MiniLoader;
