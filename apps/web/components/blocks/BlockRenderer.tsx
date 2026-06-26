"use client";

import { Github, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
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
  sm: "py-1",
  md: "py-2",
  lg: "py-4",
};

const HERO_MIN_H: Record<string, string> = {
  sm: "min-h-[160px]",
  md: "min-h-[300px]",
  lg: "min-h-[480px]",
};

const SOCIAL_ICONS = [
  { key: "socialGithub", Icon: Github, label: "GitHub" },
  { key: "socialTwitter", Icon: Twitter, label: "Twitter" },
  { key: "socialLinkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "socialInstagram", Icon: Instagram, label: "Instagram" },
  { key: "socialYoutube", Icon: Youtube, label: "YouTube" },
] as const;

export function HeroBlock({ block, isEditor }: BlockRendererProps) {
  const {
    title,
    subtitle,
    backgroundColor,
    textColor,
    paddingSize,
    textAlign,
    profileImage,
    profileImageSize,
    socialGithub,
    socialTwitter,
    socialLinkedin,
    socialInstagram,
    socialYoutube,
  } = block.props;
  const py = HERO_PADDING[paddingSize ?? "md"];
  const minH = HERO_MIN_H[paddingSize ?? "md"];

  const socialUrls: Record<string, string> = {
    socialGithub: socialGithub || "",
    socialTwitter: socialTwitter || "",
    socialLinkedin: socialLinkedin || "",
    socialInstagram: socialInstagram || "",
    socialYoutube: socialYoutube || "",
  };

  const activeSocials = SOCIAL_ICONS.filter(({ key }) => socialUrls[key]);

  const avatarSize =
    profileImageSize === "sm"
      ? "h-16 w-16"
      : profileImageSize === "lg"
      ? "h-32 w-32"
      : "h-24 w-24";

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
      {profileImage && (
        <img
          src={profileImage}
          alt={title || "Profile"}
          className={`${avatarSize} mb-4 rounded-full object-cover ring-4 ring-white/30`}
        />
      )}
      <h1 className="mb-4 text-4xl font-bold md:text-5xl">
        {title || "Your Headline Here"}
      </h1>
      {subtitle && (
        <p className="text-lg opacity-90 md:text-xl">{subtitle}</p>
      )}
      {activeSocials.length > 0 && (
        <div className="mt-5 flex gap-4">
          {activeSocials.map(({ key, Icon, label }) => (
            <a
              key={key}
              href={isEditor ? undefined : socialUrls[key]}
              target={isEditor ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="opacity-80 transition-opacity hover:opacity-100"
              style={{ color: textColor || "#ffffff" }}
              onClick={(e) => isEditor && e.preventDefault()}
            >
              <Icon className="h-6 w-6" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function TextBlock({ block, isEditor }: BlockRendererProps) {
  const { content, fontSize, textAlign, textColor, paddingSize, blockWidth, blockAlign } = block.props;
  const py = BLOCK_PADDING[paddingSize ?? "md"];
  const width = blockWidth ?? "100%";
  const align = blockAlign ?? "center";
  const marginInline =
    align === "center" ? "auto" : align === "right" ? "0 0 0 auto" : "0";

  return (
    <div
      className={`px-6 ${py}`}
      style={{
        width,
        margin: `0`,
        marginLeft: align === "center" ? "auto" : align === "right" ? "auto" : "0",
        marginRight: align === "center" ? "auto" : align === "left" ? "auto" : "0",
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

const COLUMN_RATIOS: Record<string, [number, number]> = {
  "50/50": [1, 1],
  "60/40": [3, 2],
  "40/60": [2, 3],
  "33/67": [1, 2],
  "67/33": [2, 1],
};

function VerticalDivider({ color }: { color?: string }) {
  return (
    <div
      className="self-stretch w-px shrink-0"
      style={{ backgroundColor: color || "hsl(var(--border))" }}
    />
  );
}

export function ColumnsBlock({ block, isEditor }: BlockRendererProps) {
  const {
    leftTitle,
    leftContent,
    middleTitle,
    middleContent,
    rightTitle,
    rightContent,
    columnRatio,
    fontSize,
    textColor,
    paddingSize,
    verticalDivider,
    dividerColor,
    contentAlign,
    columnBackground,
  } = block.props;
  const py = BLOCK_PADDING[paddingSize ?? "md"];
  const [leftFlex, rightFlex] = COLUMN_RATIOS[columnRatio ?? "50/50"];
  const hasLeft = !!leftTitle || !!leftContent;
  const hasMiddle = !!middleTitle || !!middleContent;
  const hasRight = !!rightTitle || !!rightContent;
  const showDivider = verticalDivider === true || verticalDivider === "true";

  const justifyMap: Record<string, string> = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
  };
  const justifyContent = justifyMap[contentAlign ?? "top"] ?? "flex-start";

  const colStyle = (flex: number, padding: string) => ({
    flex,
    minWidth: 0,
    padding,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent,
    fontSize: fontSize || "16px",
    color: textColor || undefined,
    backgroundColor: columnBackground || undefined,
    borderRadius: columnBackground ? "6px" : undefined,
  });

  const ColContent = ({ title, content }: { title?: string; content?: string }) => (
    <>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      {content && <p className="whitespace-pre-wrap">{content}</p>}
    </>
  );

  return (
    <div className={`flex items-start gap-0 px-6 ${py}`}>
      {/* Left */}
      {hasLeft && (
        <>
          <div style={colStyle(hasMiddle || hasRight ? leftFlex : 1, "12px")}>
            <ColContent title={leftTitle} content={leftContent} />
          </div>
          {showDivider && (hasMiddle || hasRight) && <VerticalDivider color={dividerColor} />}
        </>
      )}

      {/* Middle (optional 3rd column) */}
      {hasMiddle && (
        <>
          <div style={colStyle(1, "12px")}>
            <ColContent title={middleTitle} content={middleContent} />
          </div>
          {showDivider && hasRight && <VerticalDivider color={dividerColor} />}
        </>
      )}

      {/* Right */}
      {hasRight && (
        <div style={colStyle(hasLeft || hasMiddle ? rightFlex : 1, "12px")}>
          <ColContent title={rightTitle} content={rightContent} />
        </div>
      )}
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
    case "columns":
      return <ColumnsBlock block={block} isEditor={isEditor} />;
    case "divider":
      return <DividerBlock block={block} isEditor={isEditor} />;
    default:
      return null;
  }
}
