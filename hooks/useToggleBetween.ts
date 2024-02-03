import { create } from "zustand";

interface ToggleBetweenState {
  isText: boolean;
  setIsText: (e: boolean) => void;
}

const useToggleBetween = create<ToggleBetweenState>((set) => ({
  isText: false,
  setIsText: (e: boolean) => set({ isText: e }),
}));

export default useToggleBetween;
