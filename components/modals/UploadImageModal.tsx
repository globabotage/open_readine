"use client";
import useUploadImageModal from "@/hooks/modal/useUploadImageModal";
import useToggleBetween from "@/hooks/useToggleBetween";
import Button from "../Button";
import Modal from "./Modal";

const UploadImageModal = () => {
  const uploadImageModal = useUploadImageModal();
  const { isText, setIsText } = useToggleBetween();

  let bodyContet = (
    <div className="w-full h-auto py-3 flex flex-col justify-center items-center space-y-3 ">
      <div className="w-full md:w-2/3 text-yt-white mb-5">
        {isText
          ? "投稿形式を画像へ変更したあとでその投稿を保存すると、「行間」に記述されているテキスト情報は失われます。"
          : "投稿形式をテキストへ変更したあとでその投稿を保存すると、「行間」として登録されている画像情報は失われます。"}
      </div>
      <div className="w-1/3 ">
        <Button
          label="変更"
          onClick={() => {
            setIsText(!isText);
            uploadImageModal.onClose();
          }}
          outline
          small
        />
      </div>
      <div className="w-1/3 ">
        <Button
          label="キャンセル"
          onClick={() => {
            uploadImageModal.onClose();
          }}
          small
        />
      </div>
    </div>
  );
  return (
    <Modal
      onClose={uploadImageModal.onClose}
      body={bodyContet}
      isOpen={uploadImageModal.isOpen}
      onSubmit={() => {}}
      middleOnMobile
    />
  );
};

export default UploadImageModal;
