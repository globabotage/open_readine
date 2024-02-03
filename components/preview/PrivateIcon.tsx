import { RiGitRepositoryPrivateFill } from "react-icons/ri";

const PrivateIcon = () => {
  return (
    <div className="group w-auto flex flex-col relative">
      <div className="hidden absolute -top-10 -left-8 group-hover:inline-block w-0 h-0 overflow-visible">
        <div className="w-[180px] h-auto px-2 py-2 rounded-md bg-yt-atom text-xs text-center">
          この投稿は公開されていません
        </div>
      </div>

      <div>
        <RiGitRepositoryPrivateFill className="text-yellow-500" />
      </div>
    </div>
  );
};

export default PrivateIcon;
