<div align="center">
  <h1>🖼️ FrameUp</h1>
  <p><strong>Open source drag-and-drop website builder</strong></p>
  <p>Build and publish your own page at a public URL like <code>frameup.app/satvik</code></p>

  <br />

  ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
  ![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ Features

- 🎨 **Drag & Drop Editor** — Intuitive block-based page builder with live preview
- 🧱 **Block System** — Hero, Text, Image, Button, Divider blocks with customizable props
- 🚀 **Instant Publish** — One-click publish to your unique public URL
- 🌐 **Public Pages** — SEO-friendly server-rendered pages at `/username`
- 🔒 **Auth** — Clerk-powered authentication with username-based URLs
- 🌙 **Dark Mode** — Full dark mode support out of the box
- 📱 **Responsive** — Works beautifully on desktop and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Drag & Drop | dnd-kit |
| State | Zustand |
| Database | Supabase (PostgreSQL) + Prisma |
| Auth | Clerk |
| API | tRPC |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- [Supabase](https://supabase.com) account
- [Clerk](https://clerk.com) account

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/frameup.git
cd frameup
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

```bash
cp apps/web/.env.example apps/web/.env.local
```

Fill in your Clerk and Supabase credentials in `.env.local`.

4. **Set up the database**

```bash
pnpm db:generate
pnpm db:push
```

5. **Start the dev server**

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
frameup/
├── apps/
│   └── web/                    # Next.js app
│       ├── app/
│       │   ├── (auth)/         # Sign in / Sign up
│       │   ├── (builder)/      # Dashboard + Editor
│       │   ├── [username]/     # Public pages (SSR)
│       │   └── api/trpc/       # tRPC API handler
│       ├── components/
│       │   ├── blocks/         # Renderable block components
│       │   ├── editor/         # Editor UI (Canvas, Sidebar, etc.)
│       │   └── ui/             # shadcn/ui components
│       ├── lib/
│       │   ├── db/             # Prisma client
│       │   ├── store/          # Zustand editor store
│       │   └── trpc/           # tRPC setup
│       └── prisma/
│           └── schema.prisma
├── packages/
│   └── config/                 # Shared configs
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## 🧱 Available Blocks

| Block | Description |
|-------|------------|
| Hero | Full-width header with title, subtitle, and background color |
| Text | Rich text content with font size and alignment controls |
| Image | Image with URL source and alt text |
| Button | Clickable button with customizable colors and link |
| Divider | Horizontal rule with style options (solid, dashed, dotted) |

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) — React framework
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [dnd-kit](https://dndkit.com) — Drag and drop
- [Clerk](https://clerk.com) — Authentication
- [Supabase](https://supabase.com) — Database & storage
- [Prisma](https://prisma.io) — ORM
- [tRPC](https://trpc.io) — Type-safe APIs
