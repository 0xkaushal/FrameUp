"use client";

import type { Block } from "@/lib/store/editor-store";

interface BlockRendererProps {
  block: Block;
  isEditor?: boolean;
}

const HERO_PADDING: Record<string, string> = {
  sm: "py-8",
  md: "py-16",
  lg: "py-32",
};

const BLOCK_PADDING: Record<string, string> = {
  sm: "py-4",
  md: "py-8",
  lg: "py-16",
};

const HERO_MIN_H: Record<string, string> = {
  sm: "min-h-[160px]",
  md: "min-h-[300px]",
  lg: "min-h-[480px]",
};

export function HeroBlock({ block, isEditor }: BlockRendererProps) {
  const { title, subtitle, backgroundColor, textColor, paddingSize, textAlign } = block.props;
  const py = HERO_PADDING[paddingSize ?? "md"];
  const minH = HERO_MIN_H[paddingSize ?? "md"];

  return (
    <div
      className={`flex ${minH} flex-col items-center justify-center px-6 ${py}`}
      style={{
        backgroundColor: backgroundColor || "#7c3aed",
        color: textColor || "#ffffff",
        textAlign: textAlign || "center",
        alignItems:
          textAlign === "left"
            ? "flex-start"
            : textAlign === "right"
            ? "flex-end"
            : "center",
      }}
    >
      <h1 className="mb-4 text-4xl font-bold md:text-5xl">
        {title || "Your Headline Here"}
      </h1>
      {subtitle && (
        <p className="text-lg opacity-90 md:text-xl">{subtitle}</p>
      )}
    </div>
  );
}

export function TextBlock({ block, isEditor }: BlockRendererProps) {
  const { content, fontSize, textAlign, textColor, paddingSize } = block.props;
  const py = BLOCK_PADDING[paddingSize ?? "md"];

  return (
    <div
      className={`px-6 ${py}`}
      style={{
        fontSize: fontSize || "16px",
        textAlign: textAlign || "left",
        color: textColor || undefined,
      }}
    >
      <p className="whitespace-pre-wrap">
        {content || "Start typing your text here..."}
      </p>
    </div>
  );
}

export function ImageBlock({ block, isEditor }: BlockRendererProps) {
  const { src, alt, width, paddingSize } = block.props;
  const py = BLOCK_PADDING[paddingSize ?? "md"];

  return (
    <div className={`flex justify-center px-6 ${py}`}>
      {src ? (
        <img
          src={src}
          alt={alt || "Image"}
          className="max-w-full rounded-lg"
          style={{ width: width || "100%" }}
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">
            {isEditor ? "Click to add an image URL" : "No image"}
          </span>
        </div>
      )}
    </div>
  );
}

export function ButtonBlock({ block, isEditor }: BlockRendererProps) {
  const { text, url, backgroundColor, textColor, alignment, paddingSize } = block.props;
  const py = BLOCK_PADDING[paddingSize ?? "md"];

  return (
    <div
      className={`px-6 ${py}`}
      style={{ textAlign: alignment || "center" }}
    >
      <a
        href={isEditor ? undefined : url || "#"}
        target={isEditor ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="inline-block rounded-md px-6 py-3 font-medium transition-opacity hover:opacity-90"
        style={{
          backgroundColor: backgroundColor || "#7c3aed",
          color: textColor || "#ffffff",
        }}
        onClick={(e) => isEditor && e.preventDefault()}
      >
        {text || "Click Me"}
      </a>
    </div>
  );
}

export function DividerBlock({ block }: BlockRendererProps) {
  const { style, color, paddingSize } = block.props;
  const py = BLOCK_PADDING[paddingSize ?? "sm"];

  return (
    <div className={`px-6 ${py}`}>
      <hr
        className="w-full"
        style={{
          borderStyle: style || "solid",
          borderColor: color || "hsl(var(--border))",
        }}
      />
    </div>
  );
}

export function BlockRenderer({ block, isEditor }: BlockRendererProps) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} isEditor={isEditor} />;
    case "text":
      return <TextBlock block={block} isEditor={isEditor} />;
    case "image":
      return <ImageBlock block={block} isEditor={isEditor} />;
    case "button":
      return <ButtonBlock block={block} isEditor={isEditor} />;
    case "divider":
      return <DividerBlock block={block} isEditor={isEditor} />;
    default:
      return null;
  }
}
