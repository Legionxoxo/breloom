import { db } from "@/db"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { object, z } from "zod"
import CreateEventCategoryModal from "@/components/create-event-category-modal"
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator"
import { parseColor } from "@/utils"
import { HTTPException } from "hono/http-exception"

export const categoryRouter = router({
  getEventCategories: privateProcedure.query(async ({ ctx, c }) => {
    const categories = await db.eventCategory.findMany({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { updatedAt: "desc" },
    })

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const now = new Date()
        const firstDayOfMonth = startOfMonth(now)

        const [uniqueFieldCount, eventCount, lastPing] = await Promise.all([
          /* number of unique fields */
          db.event
            .findMany({
              where: {
                EventCategory: { id: category.id },
                createdAt: { gte: firstDayOfMonth },
              },
              select: { fields: true },
              distinct: ["fields"],
            })
            .then((events) => {
              const fieldNames = new Set<string>()
              events.forEach((event) => {
                Object.keys(event.fields as object).forEach((fieldName) => {
                  fieldNames.add(fieldName)
                })
              })

              return fieldNames.size
            }),
          /* how many events happened */
          db.event.count({
            where: {
              EventCategory: { id: category.id },
              createdAt: { gte: firstDayOfMonth },
            },
          }),

          /* last created event */
          db.event.findFirst({
            where: {
              EventCategory: { id: category.id },
            },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ])

        return {
          ...category,
          uniqueFieldCount,
          eventCount,
          lastPing: lastPing?.createdAt || null,
        }
      })
    )

    return c.superjson({ categories: categoriesWithCounts })
  }),

  /* delete category */
  deleteCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, c, ctx }) => {
      const { name } = input

      await db.eventCategory.delete({
        where: { name_userId: { name, userId: ctx.user.id } },
      })
      return c.json({ success: true })
    }),

  /* create category */
  CreateEventCategory: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        color: z
          .string()
          .min(1, "Color is required")
          .regex(/^#[0-9A-F]{6}$/i, "Invalid color hex"),
        emoji: z.string().emoji("Invalid emoji").optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { color, name, emoji } = input

      /* add paid plan logic later here */

      const eventCategory = await db.eventCategory.create({
        data: {
          name: name.toLowerCase(),
          color: parseColor(color),
          emoji,
          userId: user.id,
        },
      })

      return c.json({ eventCategory })
    }),

  /* insert quick start  */

  insertQuickStartCategories: privateProcedure.mutation(async ({ c, ctx }) => {
    const categories = await db.eventCategory.createMany({
      data: [
        { name: "milestone-reached", emoji: "🚀", color: 0xff6b6b },
        { name: "new-user", emoji: "🙋", color: 0xffeb3b },
        { name: "bug", emoji: "👾", color: 0x6c5ce7 },
      ].map((category) => ({
        ...category,
        userId: ctx.user.id,
      })),
    })
    return c.json({ success: true, count: categories.count })
  }),

  /* poll category ie. clicking any category shows tht category page */
  pollCategory: privateProcedure
    .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
    .query(async ({ c, ctx, input }) => {
      const { name } = input
      const category = await db.eventCategory.findUnique({
        where: { name_userId: { name, userId: ctx.user.id } },
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
      })
      if (!category) {
        throw new HTTPException(404, {
          message: `Category "${name}" not found `,
        })
      }
      const hasEvents = category._count.events > 0
      return c.json({ hasEvents })
    }),

  /* events by category name */
  getEventsByCategoryName: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        page: z.number(),
        limit: z.number().max(50),
        timeRange: z.enum(["today", "week", "month"]),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { name, page, limit, timeRange } = input

      const now = new Date()
      let startDate: Date

      switch (timeRange) {
        case "today":
          startDate = startOfDay(now)
          break
        case "week":
          startDate = startOfWeek(now, { weekStartsOn: 0 })
          break
        case "month":
          startDate = startOfMonth(now)
          break
      }

      const [events, eventsCount, uniqueFieldCount] = await Promise.all([
        db.event.findMany({
          where: {
            EventCategory: { name, userId: ctx.user.id },
            createdAt: { gte: startDate },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        db.event.count({
          where: {
            EventCategory: { name, userId: ctx.user.id },
            createdAt: { gte: startDate },
          },
        }),
        db.event
          .findMany({
            where: {
              EventCategory: { name, userId: ctx.user.id },
              createdAt: { gte: startDate },
            },
            select: {
              fields: true,
            },
            distinct: ["fields"],
          })
          .then((events) => {
            const fieldNames = new Set<string>()
            events.forEach((event) => {
              Object.keys(event.fields as object).forEach((fieldName) => {
                fieldNames.add(fieldName)
              })
            })
            return fieldNames.size
          }),
      ])

      return c.superjson({
        events,
        eventsCount,
        uniqueFieldCount,
      })
    }),
})
