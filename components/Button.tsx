"use client";
import useLoadingPost from "@/hooks/loading/useLoadingPost";
import { IconType } from "react-icons";
import MiniLoader from "./loader/MiniLoader";

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;

  name?: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  transparent?: boolean;
  icon?: IconType;
  bgColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  name,
  disabled,
  outline,
  small,
  transparent,
  icon: Icon,
  bgColor,
}) => {
  const { isLoading, setIsLoading } = useLoadingPost();
  return (
    <button
      onClick={onClick}
      name={name}
      disabled={disabled}
      className={`relative disabled:opacity-60 disabled:cursor-not-allowed rounded-lg hover:bg-opacity-80 transition w-full h-auto
        ${outline && "bg-yt-white border-black text-zinc-700 font-semibold"}
        ${transparent && "bg-transparent  text-yt-white"}
        ${!outline && !transparent && "bg-zinc-700 border-yt-white text-white"}
        ${small ? "py-1" : "py-3"}
        ${small ? "text-sm" : "text-md"}
        ${small ? "font-light" : "font-semibold"}
        ${transparent ? "border-none" : small ? "border-[1px]" : "border-2"}
    `}
    >
      {!isLoading && Icon && (
        <Icon size={24} className="absolute left-4 top-3" />
      )}
      {!isLoading && label}
      {isLoading && (
        <div className="pt-0.5">
          <MiniLoader />
        </div>
      )}
    </button>
  );
};

export default Button;
