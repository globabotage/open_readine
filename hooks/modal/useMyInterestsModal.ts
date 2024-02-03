import { create } from "zustand";

interface MyInInterestsModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useMyInInterestsModal = create<MyInInterestsModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useMyInInterestsModal;
