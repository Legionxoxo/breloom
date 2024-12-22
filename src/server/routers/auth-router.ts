import { currentUser } from "@clerk/nextjs/server"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import { db } from "@/db"

export const authRouther = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c }) => {
    /* public procedure basically route.ts */
    const auth = await currentUser()

    if (!auth) {
      return c.json({ isSynced: false }) /* not authed yet */
    }

    const user = await db.user.findFirst({
      where: { externalId: auth.id } /* getting user */,
    })

    if (!user) {
      await db.user.create({
        data: {
          quotaLimit: 100,
          email: auth.emailAddresses[0].emailAddress /* Sync user from auth  */,
          externalId: auth.id,
        },
      })
      return c.json({ isSynced: true })
    }

    return c.json({ isSynced: true }) /* authed user exist  */
  }),
})
