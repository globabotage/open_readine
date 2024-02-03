import { create } from "zustand";

interface ToggleNavbar {
  isOpenNavbar: boolean;
  setIsOpenNavbar: (e: boolean) => void;
}

const useToggleNavbar = create<ToggleNavbar>((set) => ({
  isOpenNavbar: false,
  setIsOpenNavbar: (e: boolean) => set({ isOpenNavbar: e }),
}));

export default useToggleNavbar;
