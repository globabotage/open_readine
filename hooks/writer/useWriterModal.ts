import { create } from "zustand";

interface WriterModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useWriterModal = create<WriterModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useWriterModal;
