import SkeltonBody from "@/components/loader/SkeltonBody";
import SkeltonSide from "@/components/loader/SkeltonSide";

const LoadingTest = () => {
  return (
    <div className="flex justify-center w-full h-auto min-h-screen">
      {/* ↑ Don't use max-h-screen */}
      <div
        className={`w-full md:w-1/4 md:min-w-[350px] h-auto  bg-black  pt-3 overflow-auto scale-100
          `}
      >
        <SkeltonSide />
      </div>
      <div className="hidden md:flex flex-col h-auto  px-3 pt-5 pb-28 z-10 overflow-y-auto items-center md:w-3/4 ">
        <SkeltonBody />
      </div>
    </div>
  );
};

export default LoadingTest;
