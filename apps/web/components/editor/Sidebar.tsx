"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Type, Image, MousePointer, Minus, LayoutTemplate, Wand2, Columns2 } from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";
import { TEMPLATES } from "@/lib/templates";
import type { Block } from "@/lib/store/editor-store";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const BLOCK_TYPES = [
  {
    type: "hero",
    label: "Hero",
    icon: LayoutTemplate,
    defaultProps: {
      title: "Your Headline Here",
      subtitle: "A short description about yourself",
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
    },
  },
  {
    type: "text",
    label: "Text",
    icon: Type,
    defaultProps: {
      content: "Start typing your text here...",
      fontSize: "16px",
      textAlign: "left",
      textColor: "",
    },
  },
  {
    type: "image",
    label: "Image",
    icon: Image,
    defaultProps: {
      src: "",
      alt: "Image",
      width: "100%",
    },
  },
  {
    type: "button",
    label: "Button",
    icon: MousePointer,
    defaultProps: {
      text: "Click Me",
      url: "#",
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
      alignment: "center",
    },
  },
  {
    type: "divider",
    label: "Divider",
    icon: Minus,
    defaultProps: {
      style: "solid",
      color: "",
    },
  },
  {
    type: "columns",
    label: "Multi Column",
    icon: Columns2,
    defaultProps: {
      leftContent: "Left column text...",
      rightContent: "Right column text...",
      columnRatio: "50/50",
      fontSize: "16px",
      textColor: "",
    },
  },
] as const;

export { BLOCK_TYPES };

function DraggableBlock({
  type,
  label,
  icon: Icon,
}: {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, fromSidebar: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab items-center gap-3 rounded-md border bg-card p-3 transition-colors hover:bg-accent active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function Sidebar() {
  const [tab, setTab] = useState<"blocks" | "templates">("blocks");
  const { blocks, loadSchema, setDirty } = useEditorStore();

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const confirmed =
      blocks.length === 0 ||
      window.confirm(
        "This will replace your current canvas with the template. Continue?"
      );

    if (!confirmed) return;

    const withIds: Block[] = template.blocks.map((b) => ({
      ...b,
      id: generateId(),
    }));
    loadSchema(withIds);
    setDirty(true);
  };

  return (
    <aside className="w-64 shrink-0 border-r bg-background flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b">
        <button
          onClick={() => setTab("blocks")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === "blocks"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
          Blocks
        </button>
        <button
          onClick={() => setTab("templates")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === "templates"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wand2 className="h-3.5 w-3.5" />
          Templates
        </button>
      </div>

      {/* Blocks tab */}
      {tab === "blocks" && (
        <div className="p-4">
          <div className="grid gap-2">
            {BLOCK_TYPES.map((block) => (
              <DraggableBlock
                key={block.type}
                type={block.type}
                label={block.label}
                icon={block.icon}
              />
            ))}
          </div>
        </div>
      )}

      {/* Templates tab */}
      {tab === "templates" && (
        <div className="flex flex-col gap-3 p-4 overflow-y-auto">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border bg-card p-3 flex flex-col gap-2"
            >
              <span className="text-sm font-semibold">{template.name}</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {template.description}
              </p>
              <button
                onClick={() => applyTemplate(template.id)}
                className="mt-1 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
