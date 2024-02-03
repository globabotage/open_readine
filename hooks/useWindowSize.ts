"use client";
import { useState, useEffect } from "react";

interface Size {
  width: number;
  height: number;
}
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [isMedium, setIsMedium] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // 初回のサイズを設定
    handleResize();

    // クリーンアップ関数
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 空の依存配列を指定して、エフェクトをマウント時およびアンマウント時にのみ実行

  useEffect(() => {
    setIsMedium(windowSize.width < 768);
  }, [windowSize.width]);

  return { windowSize, isMedium };
};

export default useWindowSize;
