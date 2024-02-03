"use client";
import useZoomImageModal from "@/hooks/modal/useZoomImageModal";
import Modal from "./Modal";
import { CldImage } from "next-cloudinary";

const ZoomImageModal = () => {
  const { isOpen, onClose, publicId } = useZoomImageModal();

  let bodyContet = (
    <div className="flex flex-row justify-center  ">
      <CldImage
        width="500"
        height="500"
        crop="fit"
        //width and height probably means the max valiable of width and height
        //fitは画像横幅をwidthに合わせ原寸比を維持
        //padは画像縦幅をheigth内に収め原寸比を維持.余ったスペースは背景色
        //fill は指定されたwidthとheightniを埋めるように画像を配置
        //scalseは設定したwidthとheightに合わせて画像を変形
        //responseiveの場合、fitが横幅最大化してくれるので扱い易い印象
        //GPT:https://chat.openai.com/share/81340ace-af63-4daf-80b4-c773befac102

        src={publicId}
        sizes="100vw"
        alt="Description of my image"
      />
    </div>
  );

  return (
    <Modal
      onClose={onClose}
      body={bodyContet}
      isOpen={isOpen}
      onSubmit={() => {}}
    />
  );
};

export default ZoomImageModal;
