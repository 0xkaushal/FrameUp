import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FrameUp</span>
          </Link>
          <UserButton />
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
