"use client";

import useToggleEditor from "@/hooks/useToggleEditor";
import { MdCreate } from "react-icons/md";

const EditorIcon = () => {
  const { isOpenLinesEditor, setLinesOpen } = useToggleEditor();
  return (
    <div className="w-auto ml-2">
      <MdCreate
        size={22}
        className="cursor-pointer hover:text-readine-green"
        onClick={() => setLinesOpen(true)}
      />
    </div>
  );
};

export default EditorIcon;
