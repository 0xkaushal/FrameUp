import { create } from "zustand";

export interface Block {
  id: string;
  type: "hero" | "text" | "image" | "button" | "divider";
  props: Record<string, any>;
}

interface EditorStore {
  blocks: Block[];
  selectedBlockId: string | null;
  isDirty: boolean;

  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, props: Partial<Block["props"]>) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  selectBlock: (id: string | null) => void;
  loadSchema: (schema: Block[]) => void;
  getSchema: () => Block[];
  setDirty: (dirty: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  blocks: [],
  selectedBlockId: null,
  isDirty: false,

  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks, block],
      isDirty: true,
    })),

  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id),
      selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      isDirty: true,
    })),

  updateBlock: (id, props) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, props: { ...b.props, ...props } } : b
      ),
      isDirty: true,
    })),

  reorderBlocks: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
      const newIndex = state.blocks.findIndex((b) => b.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;

      const newBlocks = [...state.blocks];
      const [moved] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, moved);

      return { blocks: newBlocks, isDirty: true };
    }),

  selectBlock: (id) => set({ selectedBlockId: id }),

  loadSchema: (schema) => set({ blocks: schema, isDirty: false, selectedBlockId: null }),

  getSchema: () => get().blocks,

  setDirty: (dirty) => set({ isDirty: dirty }),
}));
