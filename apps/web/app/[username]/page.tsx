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
  const site = await db.site.findUnique({
    where: { slug: params.username },
    include: { user: true },
  });

  if (!site) {
    return { title: "Page Not Found" };
  }

  return {
    title: `${site.name} - ${site.user.username}`,
    description: `${site.user.username}'s page built with FrameUp`,
  };
}

export default async function PublicPage({ params }: PublicPageProps) {
  const site = await db.site.findUnique({
    where: { slug: params.username },
    include: { pages: true, user: true },
  });

  if (!site) {
    notFound();
  }

  const page = site.pages[0];

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
