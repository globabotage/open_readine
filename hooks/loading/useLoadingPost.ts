import { create } from "zustand";

interface LoadingPostState {
  isLoading: boolean;
  setIsLoading: (e: boolean) => void;
}

const useLoadingPost = create<LoadingPostState>((set) => ({
  isLoading: false,
  setIsLoading: (e: boolean) => set({ isLoading: e }),
}));

export default useLoadingPost;
