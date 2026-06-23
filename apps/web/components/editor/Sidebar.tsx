"use client";

import { useDraggable } from "@dnd-kit/core";
import { Type, Image, MousePointer, Minus, LayoutTemplate } from "lucide-react";

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
  return (
    <aside className="w-64 shrink-0 border-r bg-background p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">
        Blocks
      </h2>
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
    </aside>
  );
}
