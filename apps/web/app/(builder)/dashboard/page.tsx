"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useUser } from "@clerk/nextjs";
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
import { Plus, Trash2, FolderOpen, Globe2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [wsName, setWsName] = useState("");
  const [wsDesc, setWsDesc] = useState("");

  const utils = trpc.useUtils();
  const { data: workspaces, isLoading } = trpc.getWorkspaces.useQuery();

  const createWorkspace = trpc.createWorkspace.useMutation({
    onSuccess: () => {
      toast({ title: "Workspace created!" });
      setOpen(false);
      setWsName("");
      setWsDesc("");
      utils.getWorkspaces.invalidate();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteWorkspace = trpc.deleteWorkspace.useMutation({
    onSuccess: () => {
      toast({ title: "Workspace deleted" });
      utils.getWorkspaces.invalidate();
    },
  });

  // Sync Clerk user into DB
  const syncUser = trpc.syncUser.useMutation();
  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!user || !email) return;
    const rawUsername =
      user.username ??
      email.split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const username = rawUsername.slice(0, 30);
    if (username.length >= 3) syncUser.mutate({ username, email });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      {user?.firstName && (
        <p className="mb-6 text-lg text-muted-foreground">
          Welcome back,{" "}
          <span className="font-semibold text-foreground">{user.firstName}</span>{" "}
          👋
        </p>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="text-muted-foreground">
            Organise your sites into workspaces
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a workspace</DialogTitle>
              <DialogDescription>
                Group related sites together under one workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ws-name">Name</Label>
                <Input
                  id="ws-name"
                  placeholder="My Portfolio"
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ws-desc">Description (optional)</Label>
                <Input
                  id="ws-desc"
                  placeholder="Personal projects and experiments"
                  value={wsDesc}
                  onChange={(e) => setWsDesc(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() =>
                  createWorkspace.mutate({ name: wsName, description: wsDesc || undefined })
                }
                disabled={createWorkspace.isPending || !wsName}
              >
                {createWorkspace.isPending ? "Creating..." : "Create Workspace"}
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
      ) : workspaces?.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <Globe2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No workspaces yet</h3>
            <p className="mb-4 text-muted-foreground">
              Create your first workspace to start building sites!
            </p>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workspace
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces?.map((ws) => (
            <Card key={ws.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{ws.name}</CardTitle>
                {ws.description && (
                  <CardDescription>{ws.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {ws._count.sites} site{ws._count.sites !== 1 ? "s" : ""}
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Link href={`/dashboard/${ws.id}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2" size="sm">
                    <FolderOpen className="h-3.5 w-3.5" />
                    Open
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteWorkspace.mutate({ workspaceId: ws.id })}
                  disabled={deleteWorkspace.isPending}
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
