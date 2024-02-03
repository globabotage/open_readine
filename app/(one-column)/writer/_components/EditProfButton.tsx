"use client";

import useToggleWriterEditor from "@/hooks/writer/useToggleWriterEditor";
import useWriterModal from "@/hooks/writer/useWriterModal";
import { User } from "@prisma/client";
import { useMemo } from "react";
import { MdEdit } from "react-icons/md";

interface EditProfButtonProps {
  currentUser?: User | null;
  writer: User | null;
}
const EditProfButton: React.FC<EditProfButtonProps> = ({
  currentUser,
  writer,
}) => {
  const writerModal = useWriterModal();
  const toggleWriterEditor = useToggleWriterEditor();
  const isCurrentUser = useMemo(() => {
    return currentUser?.id === writer?.id;
  }, [currentUser, writer]);

  return (
    <>
      {isCurrentUser && (
        <MdEdit
          size={22}
          className="cursor-pointer text-readine-green hover:text-yt-white "
          onClick={() => {
            toggleWriterEditor.setOpen(true);
            writerModal.onOpen();
          }}
        />
      )}{" "}
    </>
  );
};

export default EditProfButton;
