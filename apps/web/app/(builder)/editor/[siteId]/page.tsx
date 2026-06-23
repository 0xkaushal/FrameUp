"use client";

import { useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { trpc } from "@/lib/trpc/client";
import { useEditorStore, type Block } from "@/lib/store/editor-store";
import { Sidebar, BLOCK_TYPES } from "@/components/editor/Sidebar";
import { Canvas } from "@/components/editor/Canvas";
import { PropsPanel } from "@/components/editor/PropsPanel";
import { Toolbar } from "@/components/editor/Toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function EditorPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const [activeId, setActiveId] = useState<string | null>(null);

  const { blocks, loadSchema, addBlock, reorderBlocks, isDirty, setDirty } =
    useEditorStore();

  const { data: siteDetails, isLoading: siteLoading } =
    trpc.getSiteDetails.useQuery({ siteId });

  const { data: page, isLoading: pageLoading } = trpc.getPage.useQuery({
    siteId,
  });

  const saveDraft = trpc.saveDraft.useMutation({
    onSuccess: () => setDirty(false),
  });

  // Load schema from DB on first load
  const hasLoaded = useRef(false);
  useEffect(() => {
    if (page && !hasLoaded.current) {
      const raw = page.draftSchema;
      const schema: Block[] = typeof raw === "string" ? JSON.parse(raw) : (raw as Block[]) ?? [];
      loadSchema(schema);
      hasLoaded.current = true;
    }
  }, [page, loadSchema]);

  // Auto-save every 30 seconds
  const autoSave = useCallback(() => {
    if (isDirty && page?.id) {
      saveDraft.mutate({ pageId: page.id, schema: blocks });
    }
  }, [isDirty, page?.id, blocks, saveDraft]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    // If dragging from sidebar (new block)
    const dragData = active.data.current;
    if (dragData?.fromSidebar) {
      const blockType = dragData.type as Block["type"];
      const blockDef = BLOCK_TYPES.find((b) => b.type === blockType);
      if (!blockDef) return;

      const newBlock: Block = {
        id: generateId(),
        type: blockType,
        props: { ...blockDef.defaultProps },
      };
      addBlock(newBlock);
      return;
    }

    // If reordering existing blocks
    if (active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  };

  if (siteLoading || pageLoading) {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex flex-1">
          <div className="w-64 border-r p-4">
            <Skeleton className="mb-4 h-4 w-16" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="mb-2 h-12 w-full" />
            ))}
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="mx-auto h-[600px] max-w-3xl rounded-lg" />
          </div>
          <div className="w-72 border-l p-4">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Toolbar
        pageId={page?.id ?? null}
        siteName={siteDetails?.name ?? ""}
        siteSlug={siteDetails?.user?.username ?? siteDetails?.slug ?? ""}
      />
      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Sidebar />
          <Canvas />
          <DragOverlay>
            {activeId ? (
              <div className="rounded-md border bg-card p-3 shadow-lg opacity-80">
                <span className="text-sm">Dragging...</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <PropsPanel />
      </div>
    </div>
  );
}
