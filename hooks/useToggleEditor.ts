import { create } from "zustand";

interface ToggleEditorState {
  isOpenLinesEditor: boolean;
  hasOpenBetweenEditor: boolean;
}
interface ToggleEditorState {
  setLinesOpen: (e: boolean) => void;
  setBetweenOpen: (e: boolean) => void;
}
const useToggleEditor = create<ToggleEditorState>((set, get) => ({
  isOpenLinesEditor: false,
  hasOpenBetweenEditor: false,
  setLinesOpen: (e: boolean) => set({ isOpenLinesEditor: e }),
  setBetweenOpen: (e: boolean) => set({ hasOpenBetweenEditor: e }),
}));

export default useToggleEditor;
