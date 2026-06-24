import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Block } from "@/lib/store/editor-store";

interface PreviewPageProps {
  params: { siteId: string };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const site = await db.site.findFirst({
    where: { id: params.siteId, user: { clerkId: userId } },
    include: { pages: true },
  });

  if (!site) notFound();

  const page = site.pages[0];
  if (!page) notFound();

  const blocks: Block[] =
    typeof page.draftSchema === "string"
      ? JSON.parse(page.draftSchema)
      : (page.draftSchema as unknown as Block[]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-yellow-500/10 px-4 py-2 text-sm text-yellow-700 dark:text-yellow-400">
        <span>
          Preview mode — this is your draft. Changes are not published yet.
        </span>
        <a
          href={`/editor/${params.siteId}`}
          className="font-medium underline underline-offset-2 hover:opacity-80"
        >
          Back to editor
        </a>
      </div>
      <main className="min-h-screen bg-background">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} isEditor={false} />
        ))}
      </main>
    </div>
  );
}
