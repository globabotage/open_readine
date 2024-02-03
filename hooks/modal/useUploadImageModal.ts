import { create } from "zustand";

interface UploadImageModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useUploadImageModal = create<UploadImageModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useUploadImageModal;
