import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./init";

export const appRouter = router({
  // Kept for backwards-compat (dashboard calls it on mount), but it's now a no-op
  // since protectedProcedure already upserts the user on every request.
  syncUser: protectedProcedure
    .input(z.object({ username: z.string().min(3).max(30), email: z.string().email() }))
    .mutation(async ({ ctx }) => ctx.user),

  // Workspace routes
  getWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.workspace.findMany({
      where: { userId: ctx.user.id },
      include: { _count: { select: { sites: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }),

  createWorkspace: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(300).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.create({
        data: { name: input.name, description: input.description, userId: ctx.user.id },
      });
    }),

  deleteWorkspace: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.workspace.delete({
        where: { id: input.workspaceId, userId: ctx.user.id },
      });
      return { success: true };
    }),

  // Site routes
  getSites: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.site.findMany({
        where: { workspaceId: input.workspaceId, userId: ctx.user.id },
        include: { pages: { select: { isPublished: true } } },
        orderBy: { updatedAt: "desc" },
      });
    }),

  createSite: protectedProcedure
    .input(z.object({
      workspaceId: z.string(),
      name: z.string().min(1).max(100),
      slug: z.string().min(3).max(50),
    }))
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findFirst({
        where: { id: input.workspaceId, userId: ctx.user.id },
      });
      if (!workspace) throw new Error("Workspace not found");

      return ctx.db.site.create({
        data: {
          name: input.name,
          slug: input.slug,
          userId: ctx.user.id,
          workspaceId: input.workspaceId,
          pages: { create: { title: "Home", draftSchema: "[]" } },
        },
        include: { pages: true },
      });
    }),

  deleteSite: protectedProcedure
    .input(z.object({ siteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.site.delete({ where: { id: input.siteId, userId: ctx.user.id } });
      return { success: true };
    }),

  // Page/Editor routes
  getPage: protectedProcedure
    .input(z.object({ siteId: z.string() }))
    .query(async ({ ctx, input }) => {
      const site = await ctx.db.site.findFirst({
        where: { id: input.siteId, userId: ctx.user.id },
        include: { pages: true },
      });
      if (!site) throw new Error("Site not found");

      const page = site.pages[0] ?? null;
      if (!page) return null;

      return {
        ...page,
        draftSchema: JSON.parse(page.draftSchema),
        publishedSchema: page.publishedSchema ? JSON.parse(page.publishedSchema) : null,
      };
    }),

  saveDraft: protectedProcedure
    .input(z.object({ pageId: z.string(), schema: z.any() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.page.update({
        where: { id: input.pageId },
        data: { draftSchema: JSON.stringify(input.schema) },
      });
      return { success: true };
    }),

  publishPage: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.db.page.findUnique({ where: { id: input.pageId } });
      if (!page) throw new Error("Page not found");

      await ctx.db.page.update({
        where: { id: input.pageId },
        data: { publishedSchema: page.draftSchema, isPublished: true, publishedAt: new Date() },
      });
      return { success: true };
    }),

  getSiteDetails: protectedProcedure
    .input(z.object({ siteId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.site.findFirst({
        where: { id: input.siteId, userId: ctx.user.id },
        include: {
          pages: true,
          user: { select: { username: true } },
          workspace: { select: { id: true, name: true } },
        },
      });
    }),

  // Public routes
  getPublicPage: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { username: input.username },
        include: {
          sites: {
            include: { pages: true },
            take: 1,
            orderBy: { updatedAt: "desc" },
          },
        },
      });

      if (!user?.sites[0]) return null;

      const page = user.sites[0].pages[0];
      if (!page?.isPublished || !page.publishedSchema) return null;

      return {
        username: user.username,
        siteName: user.sites[0].name,
        schema: JSON.parse(page.publishedSchema),
      };
    }),
});

export type AppRouter = typeof appRouter;

