import { create } from "zustand";

interface MobileSidebarState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useMobileSidebar = create<MobileSidebarState>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useMobileSidebar;
