"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, Globe, Eye, Layers, Loader2 } from "lucide-react";
import Link from "next/link";

interface ToolbarProps {
  pageId: string | null;
  siteName: string;
  siteSlug: string;
}

export function Toolbar({ pageId, siteName, siteSlug }: ToolbarProps) {
  const { blocks, isDirty, setDirty } = useEditorStore();
  const { toast } = useToast();

  const saveDraft = trpc.saveDraft.useMutation({
    onSuccess: () => {
      setDirty(false);
      toast({ title: "Draft saved!" });
    },
    onError: () => {
      toast({ title: "Failed to save", variant: "destructive" });
    },
  });

  const publishPage = trpc.publishPage.useMutation({
    onSuccess: () => {
      toast({
        title: "Published! 🎉",
        description: `Your page is live at ${process.env.NEXT_PUBLIC_APP_URL}/${siteSlug}`,
      });
    },
    onError: () => {
      toast({ title: "Failed to publish", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!pageId) return;
    saveDraft.mutate({ pageId, schema: blocks });
  };

  const handlePublish = () => {
    if (!pageId) return;
    // Save first, then publish
    saveDraft.mutate(
      { pageId, schema: blocks },
      {
        onSuccess: () => {
          publishPage.mutate({ pageId });
        },
      }
    );
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
        </Link>
        <span className="text-sm font-medium">{siteName}</span>
        {isDirty && (
          <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-500">
            Unsaved
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/${siteSlug}`} target="_blank">
          <Button variant="ghost" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleSave}
          disabled={saveDraft.isPending || !isDirty}
        >
          {saveDraft.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
        <Button
          size="sm"
          className="gap-2"
          onClick={handlePublish}
          disabled={publishPage.isPending}
        >
          {publishPage.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          Publish
        </Button>
      </div>
    </header>
  );
}
