"use client";

import Modal from "./Modal";
import useDeleteModal from "@/hooks/modal/useDeleteModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../Button";
import useToggleEditor from "@/hooks/useToggleEditor";
import useLoadingPost from "@/hooks/loading/useLoadingPost";

const DeleteModal = () => {
  const deleteModal = useDeleteModal();
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading } = useLoadingPost();

  const { setLinesOpen, setBetweenOpen } = useToggleEditor();

  const handleClose = () => {
    deleteModal.onClose();
  };

  const handleSubmit = async () => {
    //targetにはlabel属性はないのでname属性を使う
    setIsLoading(true);
    let request;
    if (deleteModal.type === "lines") {
      request = () => axios.delete(`../api/read/${deleteModal.id}`);
    } else {
      request = () => axios.delete(`../api/between/${deleteModal.id}`);
    }

    request()
      .then(() => {
        toast.success("削除されました");
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        deleteModal.onClose();
        setIsLoading(false);
        if (deleteModal.type === "lines") {
          setLinesOpen(false);
          router.push(pathname);
        }
        if (deleteModal.type === "between") setBetweenOpen(false);
      });
  };

  const bodyContent = (
    <div className="h-1/2 w-full flex flex-col justify-center items-center gap-y-3">
      <div>投稿を削除しますか？</div>
      <div className="w-1/3">
        <Button label="削除" name="delete" onClick={handleSubmit} small />
      </div>
      <div className="w-1/3">
        <Button
          label="キャンセル"
          name="cancel"
          onClick={handleClose}
          small
          outline
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={deleteModal.isOpen}
      onClose={handleClose}
      onSubmit={() => {}}
      body={bodyContent}
    />
  );
};

export default DeleteModal;
