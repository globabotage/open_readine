import { create } from "zustand";

interface ToggleWriterEditorState {
  isOpen: boolean;
  setOpen: (e: boolean) => void;
}

const useToggleWriterEditor = create<ToggleWriterEditorState>((set, get) => ({
  isOpen: false,
  setOpen: (e: boolean) => set({ isOpen: e }),
}));

export default useToggleWriterEditor;
