"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const ALIGN_OPTIONS = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
] as const;

const SIZE_OPTIONS = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
] as const;

export function PropsPanel() {
  const { blocks, selectedBlockId, updateBlock, removeBlock, selectBlock } =
    useEditorStore();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <aside className="w-72 shrink-0 border-l bg-background p-4">
        <p className="text-sm text-muted-foreground">
          Select a block to edit its properties
        </p>
      </aside>
    );
  }

  const handlePropChange = (key: string, value: string) => {
    updateBlock(selectedBlock.id, { [key]: value });
  };

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">
          {selectedBlock.type} Block
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            removeBlock(selectedBlock.id);
            selectBlock(null);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="grid gap-4">
        {/* Universal: Block Size */}
        <div className="grid gap-2">
          <Label className="text-xs">Block Size</Label>
          <div className="flex gap-1">
            {SIZE_OPTIONS.map(({ value, label }) => (
              <Button
                key={value}
                variant={
                  (selectedBlock.props.paddingSize ?? "md") === value
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="flex-1"
                onClick={() => handlePropChange("paddingSize", value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {selectedBlock.type === "hero" && (
          <>
            <PropField
              label="Title"
              value={selectedBlock.props.title || ""}
              onChange={(v) => handlePropChange("title", v)}
            />
            <PropField
              label="Subtitle"
              value={selectedBlock.props.subtitle || ""}
              onChange={(v) => handlePropChange("subtitle", v)}
            />
            <div className="grid gap-2">
              <Label className="text-xs">Text Align</Label>
              <div className="flex gap-1">
                {ALIGN_OPTIONS.map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={
                      (selectedBlock.props.textAlign ?? "center") === value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePropChange("textAlign", value)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
            <PropField
              label="Background Color"
              value={selectedBlock.props.backgroundColor || "#7c3aed"}
              onChange={(v) => handlePropChange("backgroundColor", v)}
              type="color"
            />
            <PropField
              label="Text Color"
              value={selectedBlock.props.textColor || "#ffffff"}
              onChange={(v) => handlePropChange("textColor", v)}
              type="color"
            />
          </>
        )}

        {selectedBlock.type === "text" && (
          <>
            <div className="grid gap-2">
              <Label className="text-xs">Content</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedBlock.props.content || ""}
                onChange={(e) => handlePropChange("content", e.target.value)}
              />
            </div>
            <PropField
              label="Font Size"
              value={selectedBlock.props.fontSize || "16px"}
              onChange={(v) => handlePropChange("fontSize", v)}
            />
            <div className="grid gap-2">
              <Label className="text-xs">Text Align</Label>
              <div className="flex gap-1">
                {ALIGN_OPTIONS.map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={
                      (selectedBlock.props.textAlign ?? "left") === value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePropChange("textAlign", value)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
            <PropField
              label="Text Color"
              value={selectedBlock.props.textColor || ""}
              onChange={(v) => handlePropChange("textColor", v)}
              type="color"
            />
          </>
        )}

        {selectedBlock.type === "image" && (
          <>
            <PropField
              label="Image URL"
              value={selectedBlock.props.src || ""}
              onChange={(v) => handlePropChange("src", v)}
              placeholder="https://example.com/image.jpg"
            />
            <PropField
              label="Alt Text"
              value={selectedBlock.props.alt || ""}
              onChange={(v) => handlePropChange("alt", v)}
            />
            <PropField
              label="Width"
              value={selectedBlock.props.width || "100%"}
              onChange={(v) => handlePropChange("width", v)}
            />
          </>
        )}

        {selectedBlock.type === "button" && (
          <>
            <PropField
              label="Button Text"
              value={selectedBlock.props.text || ""}
              onChange={(v) => handlePropChange("text", v)}
            />
            <PropField
              label="Link URL"
              value={selectedBlock.props.url || ""}
              onChange={(v) => handlePropChange("url", v)}
              placeholder="https://..."
            />
            <PropField
              label="Background Color"
              value={selectedBlock.props.backgroundColor || "#7c3aed"}
              onChange={(v) => handlePropChange("backgroundColor", v)}
              type="color"
            />
            <PropField
              label="Text Color"
              value={selectedBlock.props.textColor || "#ffffff"}
              onChange={(v) => handlePropChange("textColor", v)}
              type="color"
            />
            <div className="grid gap-2">
              <Label className="text-xs">Alignment</Label>
              <div className="flex gap-1">
                {ALIGN_OPTIONS.map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={
                      (selectedBlock.props.alignment ?? "center") === value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePropChange("alignment", value)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedBlock.type === "divider" && (
          <>
            <div className="grid gap-2">
              <Label className="text-xs">Style</Label>
              <div className="flex gap-1">
                {["solid", "dashed", "dotted"].map((s) => (
                  <Button
                    key={s}
                    variant={
                      selectedBlock.props.style === s ? "default" : "outline"
                    }
                    size="sm"
                    className="flex-1 capitalize"
                    onClick={() => handlePropChange("style", s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <PropField
              label="Color"
              value={selectedBlock.props.color || ""}
              onChange={(v) => handlePropChange("color", v)}
              type="color"
            />
          </>
        )}
      </div>
    </aside>
  );
}

function PropField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "color";
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        {type === "color" && (
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-10 shrink-0 cursor-pointer rounded-md border"
          />
        )}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
      </div>
    </div>
  );
}
