import { z } from "zod";
import { publicProcedure, createRouter } from "../../trpc/init";

export const userRouter = createRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return {
        id: input.id,
        name: "Sanjay",
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.email(),
      }),
    )
    .mutation(async ({ input }) => {
      return {
        id: crypto.randomUUID(),
        ...input,
      };
    }),
});
