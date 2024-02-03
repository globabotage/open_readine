"use client";
interface IconWrapperProps {
  children: React.ReactNode;
  diameter: string;
  logo?: boolean;
  onClick?: () => void;
}

const IconWrapper: React.FC<IconWrapperProps> = ({
  children,
  diameter,
  logo,
  onClick,
}) => {
  return (
    <div
      className={`cursor-auto rounded-full bg-black flex items-center border-2 border-bg-yt-atom hover:bg-yt-component shadow-yt-atom shadow-md hover:shadow-lg
    ${diameter}
    ${logo ? "pl-1.5" : "justify-center"}
    
    `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default IconWrapper;
