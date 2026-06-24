"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Globe,
  ChevronLeft,
} from "lucide-react";

export default function WorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [siteSlug, setSiteSlug] = useState("");

  const utils = trpc.useUtils();
  const { data: sites, isLoading } = trpc.getSites.useQuery({ workspaceId });
  const { data: workspaces } = trpc.getWorkspaces.useQuery();
  const workspace = workspaces?.find((w) => w.id === workspaceId);

  const createSite = trpc.createSite.useMutation({
    onSuccess: () => {
      toast({ title: "Site created!", description: "Start building your page." });
      setOpen(false);
      setSiteName("");
      setSiteSlug("");
      utils.getSites.invalidate({ workspaceId });
      utils.getWorkspaces.invalidate();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteSite = trpc.deleteSite.useMutation({
    onSuccess: () => {
      toast({ title: "Site deleted" });
      utils.getSites.invalidate({ workspaceId });
      utils.getWorkspaces.invalidate();
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Workspaces
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          {workspace?.name ?? "Workspace"}
        </span>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{workspace?.name ?? "Sites"}</h1>
          {workspace?.description && (
            <p className="text-muted-foreground">{workspace.description}</p>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new site</DialogTitle>
              <DialogDescription>
                Give your site a name and a unique URL slug.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Site Name</Label>
                <Input
                  id="name"
                  placeholder="My Portfolio"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">frameup.app/</span>
                  <Input
                    id="slug"
                    placeholder="my-site"
                    value={siteSlug}
                    onChange={(e) =>
                      setSiteSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() =>
                  createSite.mutate({ workspaceId, name: siteName, slug: siteSlug })
                }
                disabled={createSite.isPending || !siteName || !siteSlug}
              >
                {createSite.isPending ? "Creating..." : "Create Site"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sites?.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <Globe className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No sites yet</h3>
            <p className="mb-4 text-muted-foreground">
              Create your first site in this workspace!
            </p>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Site
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites?.map((site) => (
            <Card key={site.id}>
              <CardHeader>
                <CardTitle className="text-lg">{site.name}</CardTitle>
                <CardDescription className="font-mono text-xs">
                  frameup.app/{site.slug}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      site.pages[0]?.isPublished ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {site.pages[0]?.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Link href={`/editor/${site.id}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2" size="sm">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>
                {site.pages[0]?.isPublished && (
                  <Link href={`/${site.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSite.mutate({ siteId: site.id })}
                  disabled={deleteSite.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
