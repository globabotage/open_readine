import Skelton from "@/components/loader/Skelton";

const Loading = () => {
  return (
    <div className="flex justify-center w-full h-auto max-h-screen ">
      <div
        className={`flex w-full md:w-1/4 min-w-[350px] h-auto max-h-screen bg-black relative justify-center px-1
        `}
      >
        <Skelton />
      </div>
      <div className="hidden md:flex flex-col h-auto max-h-screen  px-3 pt-5 pb-28 z-10 overflow-y-auto items-center md:w-3/4">
        <div className={`w-full text-white  md:w-full lg:w-11/12`}>
          <Skelton />
        </div>
      </div>
    </div>
  );
};

export default Loading;
