import { create } from "zustand";

interface DeleteModalState {
  isOpen: boolean;
  onOpen: (type: "lines" | "between" | null, id?: string | null) => void;
  onClose: () => void;
  type: "lines" | "between" | null;
  id?: string | null;
}

const useDeleteModal = create<DeleteModalState>((set) => ({
  isOpen: false,
  onOpen: (type, id) => set({ isOpen: true, type, id }),
  onClose: () => set({ isOpen: false, type: null }),
  type: "lines",
  betweenId: null,
}));

export default useDeleteModal;
