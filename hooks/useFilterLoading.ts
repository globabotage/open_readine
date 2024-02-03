import { create } from "zustand";

interface FilterLoadingState {
  isLoading: boolean;
  setIsLoading: (e: boolean) => void;
}

const useFilterLoading = create<FilterLoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (e: boolean) => set({ isLoading: e }),
}));

export default useFilterLoading;
