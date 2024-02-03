"use client";

import { useEffect, useState } from "react";

interface CLinentOnlyProps {
  children: React.ReactNode;
}

//このコンポーネントはハイドレーションエラーを回避するためにある
//が、next.jsをlatest ver にupdateしたあたり(2023/9/12)からこれでラップするページが正しく表示されないので、現在unused.
const CLinentOnly: React.FC<CLinentOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

export default CLinentOnly;
