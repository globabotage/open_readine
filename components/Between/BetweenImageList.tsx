"use client";
import useZoomImageModal from "@/hooks/modal/useZoomImageModal";
import { UploadedImage } from "@prisma/client";
import axios from "axios";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { TbPhotoPlus } from "react-icons/tb";
import ZoomImageModal from "../modals/ZoomImageModal";

interface BetweenImageListProps {
  setValue?: UseFormSetValue<FieldValues>;
  viewOnly?: boolean;
  images?: UploadedImage[];
  betweenId?: string;
}

const BetweenImageList: React.FC<BetweenImageListProps> = ({
  setValue,
  viewOnly,
  images,
  betweenId,
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    images ? images : []
  );

  const zoomImageModal = useZoomImageModal();
  const [hiddenImageIds, setHiddenImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (uploadedImages && setValue) {
      setValue("imageUrls", uploadedImages);
    }
  }, [setValue, uploadedImages]);

  const handleUpload = async (result: any) => {
    const url = result.info.secure_url;
    const public_id = result.info.public_id;

    const response = await axios.post("/api/upload_image", {
      url: url,
      public_id: public_id,
      betweenId: betweenId ? betweenId : null,
    });
    const resImages = response.data;
    const newImages = resImages.filter(
      (image: any) => !hiddenImageIds.includes(image.publicId)
    );
    setUploadedImages(newImages);
  };

  const deleteImage = async (publicId: string) => {
    const newHiddenImageIds = [...hiddenImageIds, publicId];

    const updatedImages = uploadedImages.filter(
      (image) => !newHiddenImageIds.includes(image.publicId)
    );
    setHiddenImageIds(newHiddenImageIds);
    setUploadedImages(updatedImages);
  };

  return (
    <>
      <div className="w-full h-auto  flex flex-col md:flex-row items-center gap-3 my-2">
        {uploadedImages.map((image) => (
          <div key={image.id} className="group w-auto h-auto  relative ">
            <CldImage
              width="300"
              height="300"
              src={image.publicId}
              // sizes="100vw"
              crop="fill"
              alt="Description of my image"
              className=" z-10 group-hover:opacity-60 "
              onClick={() => {
                if (viewOnly) {
                  zoomImageModal.setPublicId(image.publicId);
                  zoomImageModal.onOpen();
                } else {
                  return;
                }
              }}
            />

            {!viewOnly && (
              <div className=" absolute top-0 right-0 z-50 text-readine-green hover:text-yt-white hover:scale-125 transform duration-150 ">
                <AiOutlineClose
                  size={30}
                  className="cursor-pointer"
                  onClick={() => deleteImage(image.publicId)}
                />
              </div>
            )}
          </div>
        ))}

        {!viewOnly && (!uploadedImages || uploadedImages.length <= 2) && (
          <div className="">
            <CldUploadWidget
              onUpload={handleUpload}
              uploadPreset="lcmvuppi"
              options={{
                maxFiles: 1,
              }}
            >
              {({ open }) => {
                function handleOnClick(e: any) {
                  e.preventDefault();
                  open();
                }

                return (
                  <div
                    onClick={handleOnClick}
                    className="
                  w-auto
                  h-auto
                  min-w-[300px]
                  min-h-[300px]
                  relative
                  cursor-pointer
                  hover:opacity-70
                  transition
                  border-dashed 
                  border-2 
                  border-yt-atom
                  p-16
                  flex
                  flex-col
                  justify-center
                  items-center
                  space-y-2
                  text-neutral-600
                "
                  >
                    <TbPhotoPlus size={40} />
                    <div className="font-semibold text-center sm:text-sm">
                      画像を追加
                      <br />
                      （上限３枚）
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>
          </div>
        )}
      </div>
      <ZoomImageModal />
    </>
  );
};

export default BetweenImageList;
