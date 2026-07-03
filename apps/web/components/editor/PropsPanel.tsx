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

        {/* Universal: Block Width */}
        <div className="grid gap-2">
          <Label className="text-xs">Block Width</Label>
          <div className="flex gap-1">
            {(["100%", "50%"] as const).map((w) => (
              <Button
                key={w}
                variant={(selectedBlock.props.blockWidth ?? "100%") === w ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => handlePropChange("blockWidth", w)}
              >
                {w === "100%" ? "Full" : "Half"}
              </Button>
            ))}
          </div>
        </div>

        {/* Universal: Column Pin (half-width only) */}
        {(selectedBlock.props.blockWidth ?? "100%") === "50%" && (
          <div className="grid gap-2">
            <Label className="text-xs">Column Pin</Label>
            <div className="flex gap-1">
              {([["", "Auto"], ["1", "Left"], ["2", "Right"]] as const).map(([val, label]) => (
                <Button
                  key={val}
                  variant={(selectedBlock.props.colPin ?? "") === val ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handlePropChange("colPin", val)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}

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
            <PropField
              label="Profile Image URL"
              value={selectedBlock.props.profileImage || ""}
              onChange={(v) => handlePropChange("profileImage", v)}
              placeholder="https://example.com/avatar.jpg"
            />
            <div className="grid gap-2">
              <Label className="text-xs">Profile Image Size</Label>
              <div className="flex gap-1">
                {SIZE_OPTIONS.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={
                      (selectedBlock.props.profileImageSize ?? "md") === value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePropChange("profileImageSize", value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
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
            <div className="grid gap-2">
              <Label className="text-xs font-semibold">Social Links</Label>
              <div className="grid gap-2">
                <PropField
                  label="GitHub URL"
                  value={selectedBlock.props.socialGithub || ""}
                  onChange={(v) => handlePropChange("socialGithub", v)}
                  placeholder="https://github.com/..."
                />
                <PropField
                  label="Twitter / X URL"
                  value={selectedBlock.props.socialTwitter || ""}
                  onChange={(v) => handlePropChange("socialTwitter", v)}
                  placeholder="https://twitter.com/..."
                />
                <PropField
                  label="LinkedIn URL"
                  value={selectedBlock.props.socialLinkedin || ""}
                  onChange={(v) => handlePropChange("socialLinkedin", v)}
                  placeholder="https://linkedin.com/..."
                />
                <PropField
                  label="Instagram URL"
                  value={selectedBlock.props.socialInstagram || ""}
                  onChange={(v) => handlePropChange("socialInstagram", v)}
                  placeholder="https://instagram.com/..."
                />
                <PropField
                  label="YouTube URL"
                  value={selectedBlock.props.socialYoutube || ""}
                  onChange={(v) => handlePropChange("socialYoutube", v)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
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
            <div className="grid gap-2">
              <Label className="text-xs">Block Width</Label>
              <div className="flex gap-1">
                {["25%", "50%", "75%", "100%"].map((w) => (
                  <Button
                    key={w}
                    variant={
                      (selectedBlock.props.blockWidth ?? "100%") === w
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handlePropChange("blockWidth", w)}
                  >
                    {w}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Block Alignment</Label>
              <div className="flex gap-1">
                {ALIGN_OPTIONS.map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={
                      (selectedBlock.props.blockAlign ?? "center") === value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePropChange("blockAlign", value)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
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

        {selectedBlock.type === "columns" && (
          <>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold">Left Column</Label>
              <PropField
                label="Title (optional)"
                value={selectedBlock.props.leftTitle || ""}
                onChange={(v) => handlePropChange("leftTitle", v)}
                placeholder="Heading..."
              />
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedBlock.props.leftContent || ""}
                placeholder="Body text..."
                onChange={(e) => handlePropChange("leftContent", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold">Middle Column (optional — enables 3 columns)</Label>
              <PropField
                label="Title (optional)"
                value={selectedBlock.props.middleTitle || ""}
                onChange={(v) => handlePropChange("middleTitle", v)}
                placeholder="Heading..."
              />
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedBlock.props.middleContent || ""}
                placeholder="Leave empty for 2 columns"
                onChange={(e) => handlePropChange("middleContent", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold">Right Column</Label>
              <PropField
                label="Title (optional)"
                value={selectedBlock.props.rightTitle || ""}
                onChange={(v) => handlePropChange("rightTitle", v)}
                placeholder="Heading..."
              />
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedBlock.props.rightContent || ""}
                placeholder="Body text..."
                onChange={(e) => handlePropChange("rightContent", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Column Ratio (2-col only)</Label>
              <div className="flex flex-wrap gap-1">
                {["50/50", "60/40", "40/60", "67/33", "33/67"].map((r) => (
                  <Button
                    key={r}
                    variant={
                      (selectedBlock.props.columnRatio ?? "50/50") === r
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handlePropChange("columnRatio", r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Vertical Divider</Label>
              <div className="flex gap-1">
                <Button
                  variant={selectedBlock.props.verticalDivider ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handlePropChange("verticalDivider", !selectedBlock.props.verticalDivider as any)}
                >
                  {selectedBlock.props.verticalDivider ? "On" : "Off"}
                </Button>
              </div>
            </div>
            {selectedBlock.props.verticalDivider && (
              <PropField
                label="Divider Color"
                value={selectedBlock.props.dividerColor || ""}
                onChange={(v) => handlePropChange("dividerColor", v)}
                type="color"
              />
            )}
            <div className="grid gap-2">
              <Label className="text-xs">Content Alignment</Label>
              <div className="flex gap-1">
                {(["top", "center", "bottom"] as const).map((a) => (
                  <Button
                    key={a}
                    variant={(selectedBlock.props.contentAlign ?? "top") === a ? "default" : "outline"}
                    size="sm"
                    className="flex-1 capitalize"
                    onClick={() => handlePropChange("contentAlign", a)}
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </div>
            <PropField
              label="Column Background"
              value={selectedBlock.props.columnBackground || ""}
              onChange={(v) => handlePropChange("columnBackground", v)}
              type="color"
            />
            <PropField
              label="Font Size"
              value={selectedBlock.props.fontSize || "16px"}
              onChange={(v) => handlePropChange("fontSize", v)}
            />
            <PropField
              label="Text Color"
              value={selectedBlock.props.textColor || ""}
              onChange={(v) => handlePropChange("textColor", v)}
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
