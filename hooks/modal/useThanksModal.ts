import { create } from "zustand";

interface ThanksModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useThanksModal = create<ThanksModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useThanksModal;
