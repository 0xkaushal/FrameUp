import { initTRPC, TRPCError } from "@trpc/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import superjson from "superjson";
import { db } from "@/lib/db";

export const createTRPCContext = async () => {
  const { userId } = await auth();
  const clerkUser = userId ? await currentUser() : null;

  return {
    db,
    userId,
    clerkUser,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.clerkUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Auto-upsert the user on every protected call — eliminates syncUser race condition
  const email =
    ctx.clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const rawUsername =
    ctx.clerkUser.username ??
    email.split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const username = rawUsername.slice(0, 30);

  const user = await ctx.db.user.upsert({
    where: { clerkId: ctx.userId },
    update: { email, username },
    create: { clerkId: ctx.userId, username, email },
  });

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      user,
    },
  });
});
