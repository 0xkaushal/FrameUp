import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Block } from "@/lib/store/editor-store";
import type { Metadata } from "next";

interface PublicPageProps {
  params: { username: string };
}

export async function generateMetadata({
  params,
}: PublicPageProps): Promise<Metadata> {
  const user = await db.user.findUnique({
    where: { username: params.username },
    include: {
      sites: {
        take: 1,
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!user || !user.sites[0]) {
    return { title: "Page Not Found" };
  }

  return {
    title: `${user.sites[0].name} - ${user.username}`,
    description: `${user.username}'s page built with FrameUp`,
  };
}

export default async function PublicPage({ params }: PublicPageProps) {
  const user = await db.user.findUnique({
    where: { username: params.username },
    include: {
      sites: {
        include: { pages: true },
        take: 1,
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!user || !user.sites[0]) {
    notFound();
  }

  const page = user.sites[0].pages[0];

  if (!page || !page.isPublished || !page.publishedSchema) {
    notFound();
  }

  const blocks: Block[] = typeof page.publishedSchema === "string"
    ? JSON.parse(page.publishedSchema)
    : (page.publishedSchema as unknown as Block[]);

  return (
    <main className="min-h-screen bg-background">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} isEditor={false} />
      ))}
      {/* Powered by FrameUp footer */}
      <footer className="border-t py-4 text-center">
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || "/"}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Built with FrameUp
        </a>
      </footer>
    </main>
  );
}
