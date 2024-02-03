"use client";
import { use, useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";
import useWindowSize from "@/hooks/useWindowSize";
interface ModalProps {
  onClose: () => void;
  onSubmit: () => void;

  isOpen?: boolean;
  title?: string | React.ReactElement;
  body?: React.ReactElement;
  footer?: React.ReactElement | null;
  actionLabel?: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  search?: boolean;
  shortHeight?: boolean;
  middleOnMobile?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  search,
  shortHeight,
  middleOnMobile,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const { isMedium } = useWindowSize();

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    // if (disabled) {
    //   return;
    // }
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }
    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none focus:outline-none bg-neutral-800/60  text-yt-white">
        <div
          className={`relative w-full md:w-5/6 lg:w-4/6 my-6 mx-auto h-full md:h-auto
          ${shortHeight && "max-h-[700px] "}
        `}
        >
          {/*content*/}

          <div
            className={`translate h-full 
              ${
                showModal
                  ? "translate-y-0 md:translate-y-10"
                  : "translate-y-full"
              }  
              ${showModal ? "opacity-100" : "opacity-0"}
              ${search ? "  duration-100" : " duration-300 "}
              ${middleOnMobile && isMedium ? " translate-y-36" : ""}
              `}
          >
            <div
              className={`translate h-auto  border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-react-md-editor-dark/40 backdrop-blur-sm outline-none focus:outline-none `}
            >
              {/*header*/}
              <div className="flex items-start py-4 px-2 rounded-t justify-center relative border-b-[1px]">
                <button
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute left-3 md:left-9 text-yt-white  cursor-pointer"
                >
                  <IoMdClose size={18} />
                </button>
                <div className="min-h-[16px] text-lg font-semibold">
                  {title}
                </div>
              </div>
              {/*body*/}
              <div className="relative p-6">{body}</div>
              {/*footer*/}
              {footer && (
                <div className="flex flex-col gap-2 p-6">
                  <div className="flex flex-row items-center gap-4 w-full">
                    {secondaryAction && secondaryActionLabel && (
                      <Button
                        outline
                        disabled={disabled}
                        label={secondaryActionLabel}
                        onClick={handleSecondaryAction}
                      />
                    )}
                    {!search && (
                      <Button
                        disabled={disabled}
                        label={actionLabel as string}
                        onClick={handleSubmit}
                      />
                    )}
                  </div>
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
