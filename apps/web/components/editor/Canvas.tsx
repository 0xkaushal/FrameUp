"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/lib/store/editor-store";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { GripVertical } from "lucide-react";
import type { Block } from "@/lib/store/editor-store";

function SortableBlock({ block }: { block: Block }) {
  const { selectedBlockId, selectBlock } = useEditorStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedBlockId === block.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-md transition-all ${
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "hover:ring-1 hover:ring-muted-foreground/20"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 cursor-grab rounded-md bg-muted p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <BlockRenderer block={block} isEditor />
    </div>
  );
}

export function Canvas() {
  const { blocks, selectBlock } = useEditorStore();

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

  return (
    <div
      className="flex-1 overflow-y-auto bg-muted/30 p-8"
      onClick={() => selectBlock(null)}
    >
      <div
        ref={setNodeRef}
        className={`mx-auto min-h-[600px] max-w-3xl rounded-lg border bg-background shadow-sm transition-colors ${
          isOver ? "border-primary border-dashed" : ""
        }`}
      >
        {blocks.length === 0 ? (
          <div className="flex h-[600px] flex-col items-center justify-center text-muted-foreground">
            <p className="text-lg font-medium">Drop blocks here</p>
            <p className="text-sm">
              Drag blocks from the sidebar to start building your page
            </p>
          </div>
        ) : (
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1 p-4">
              {blocks.map((block) => (
                <SortableBlock key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
