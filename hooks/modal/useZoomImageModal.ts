import { create } from "zustand";

interface ZoomImageModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  publicId: string;
  setPublicId: (e: string) => void;
}

const useZoomImageModal = create<ZoomImageModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  publicId: "",
  setPublicId: (e: string) => set({ publicId: e }),
}));

export default useZoomImageModal;
