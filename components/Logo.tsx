"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  modal?: boolean;
}
const Logo: React.FC<LogoProps> = ({ modal }) => {
  return (
    <Link className="w-fit h-fit" href="/">
      <Image
        alt="Logo"
        className={`${!modal ? "hidden md:block md:cursor-pointer" : ""}`}
        height={80}
        width={80}
        src="/images/logo.png"
        priority // 画像の読み込みを優先
      />
    </Link>
  );
};

export default Logo;
