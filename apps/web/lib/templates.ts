import type { Block } from "@/lib/store/editor-store";

export interface Template {
  id: string;
  name: string;
  description: string;
  blocks: Omit<Block, "id">[];
}

export const TEMPLATES: Template[] = [
  {
    id: "personal-bio",
    name: "Personal Bio",
    description: "A simple personal page with intro, about section, and a contact button.",
    blocks: [
      {
        type: "hero",
        props: {
          title: "Hi, I'm Your Name",
          subtitle: "Designer · Developer · Creator",
          backgroundColor: "#7c3aed",
          textColor: "#ffffff",
        },
      },
      {
        type: "text",
        props: {
          content:
            "Welcome to my personal page! I'm passionate about building beautiful digital experiences. I work with modern web technologies and love turning ideas into reality.",
          fontSize: "16px",
          textAlign: "center",
          textColor: "",
        },
      },
      {
        type: "divider",
        props: { style: "solid", color: "" },
      },
      {
        type: "button",
        props: {
          text: "Get in Touch",
          url: "mailto:hello@example.com",
          backgroundColor: "#7c3aed",
          textColor: "#ffffff",
          alignment: "center",
        },
      },
    ],
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "A product landing page with a hero, feature text, and a call-to-action.",
    blocks: [
      {
        type: "hero",
        props: {
          title: "The Product You've Been Waiting For",
          subtitle: "Fast, simple, and built for everyone.",
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
        },
      },
      {
        type: "text",
        props: {
          content:
            "✦ Blazing fast performance\n✦ Easy to set up in minutes\n✦ Works on any device\n✦ No technical knowledge required",
          fontSize: "18px",
          textAlign: "center",
          textColor: "",
        },
      },
      {
        type: "button",
        props: {
          text: "Get Started for Free",
          url: "#",
          backgroundColor: "#2563eb",
          textColor: "#ffffff",
          alignment: "center",
        },
      },
      {
        type: "divider",
        props: { style: "solid", color: "" },
      },
      {
        type: "text",
        props: {
          content: "© 2025 Your Company. All rights reserved.",
          fontSize: "14px",
          textAlign: "center",
          textColor: "#94a3b8",
        },
      },
    ],
  },
  {
    id: "link-in-bio",
    name: "Link in Bio",
    description: "A minimal link-in-bio page with your name and social/link buttons.",
    blocks: [
      {
        type: "hero",
        props: {
          title: "@yourhandle",
          subtitle: "Content creator · Sharing ideas that matter",
          backgroundColor: "#ec4899",
          textColor: "#ffffff",
        },
      },
      {
        type: "button",
        props: {
          text: "🌐 My Website",
          url: "https://example.com",
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          alignment: "center",
        },
      },
      {
        type: "button",
        props: {
          text: "🐦 Twitter / X",
          url: "https://twitter.com",
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          alignment: "center",
        },
      },
      {
        type: "button",
        props: {
          text: "📸 Instagram",
          url: "https://instagram.com",
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          alignment: "center",
        },
      },
      {
        type: "button",
        props: {
          text: "💼 LinkedIn",
          url: "https://linkedin.com",
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          alignment: "center",
        },
      },
    ],
  },
];
