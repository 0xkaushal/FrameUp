import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./init";

export const appRouter = router({
  // User routes
  syncUser: protectedProcedure
    .input(
      z.object({
        username: z.string().min(3).max(30),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("username",input.username,input.email)
      const user = await ctx.db.user.upsert({
        where: { clerkId: ctx.userId },
        update: { username: input.username, email: input.email },
        create: {
          clerkId: ctx.userId,
          username: input.username,
          email: input.email,
        },
      });
      return user;
    }),

  // Site routes
  getSites: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
    });
    if (!user) return [];

    return ctx.db.site.findMany({
      where: { userId: user.id },
      include: { pages: { select: { isPublished: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }),

  createSite: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(3).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });
      if (!user) throw new Error("User not found");

      const site = await ctx.db.site.create({
        data: {
          name: input.name,
          slug: input.slug,
          userId: user.id,
          pages: {
            create: {
              title: "Home",
              draftSchema: "[]",
            },
          },
        },
        include: { pages: true },
      });
      return site;
    }),

  deleteSite: protectedProcedure
    .input(z.object({ siteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });
      if (!user) throw new Error("User not found");

      await ctx.db.site.delete({
        where: { id: input.siteId, userId: user.id },
      });
      return { success: true };
    }),

  // Page/Editor routes
  getPage: protectedProcedure
    .input(z.object({ siteId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });
      if (!user) throw new Error("User not found");

      const site = await ctx.db.site.findFirst({
        where: { id: input.siteId, userId: user.id },
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
    .input(
      z.object({
        pageId: z.string(),
        schema: z.any(),
      })
    )
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
      const page = await ctx.db.page.findUnique({
        where: { id: input.pageId },
      });
      if (!page) throw new Error("Page not found");

      await ctx.db.page.update({
        where: { id: input.pageId },
        data: {
          publishedSchema: page.draftSchema,
          isPublished: true,
          publishedAt: new Date(),
        },
      });
      return { success: true };
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

      if (!user || !user.sites[0]) return null;

      const page = user.sites[0].pages[0];
      if (!page || !page.isPublished || !page.publishedSchema) return null;

      return {
        username: user.username,
        siteName: user.sites[0].name,
        schema: JSON.parse(page.publishedSchema),
      };
    }),

  getSiteDetails: protectedProcedure
    .input(z.object({ siteId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
      });
      if (!user) throw new Error("User not found");

      return ctx.db.site.findFirst({
        where: { id: input.siteId, userId: user.id },
        include: { pages: true, user: { select: { username: true } } },
      });
    }),
});

export type AppRouter = typeof appRouter;
