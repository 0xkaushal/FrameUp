"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Layers, Zap, Globe } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FrameUp</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/your-username/frameup"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            {isLoaded && (
              isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
            <Github className="mr-2 h-3.5 w-3.5" />
            Open Source & Free Forever
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Build your website.
            <br />
            <span className="text-primary">Share it with the world.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            FrameUp is an open source drag-and-drop website builder. Create
            beautiful pages and publish them instantly at your own public URL.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              <Button size="lg" className="gap-2">
                Start Building Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://github.com/your-username/frameup"
              target="_blank"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <Github className="h-4 w-4" />
                Star on GitHub
              </Button>
            </Link>
          </div>
          {/* Example URLs */}
          <div className="pt-8">
            <p className="mb-3 text-sm text-muted-foreground">
              Your page, your URL:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["satvik", "alex", "jordan"].map((name) => (
                <code
                  key={name}
                  className="rounded-md bg-muted px-3 py-1.5 text-sm font-mono"
                >
                  frameup.app/<span className="text-primary">{name}</span>
                </code>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Everything you need to build your page
          </h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-primary" />}
              title="Drag & Drop"
              description="Intuitive block-based editor. Just drag, drop, and customize to build your perfect page."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Instant Publish"
              description="One click to publish. Your page goes live immediately at your unique URL."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-primary" />}
              title="Your Own URL"
              description="Get your own public page at frameup.app/username. Share it anywhere."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to build?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of creators building their online presence with
            FrameUp.
          </p>
          <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
            <Button size="lg" className="gap-2">
              Create Your Page
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-primary" />
            <span className="font-semibold">FrameUp</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Open source under MIT License
          </p>
          <Link
            href="https://github.com/your-username/frameup"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
