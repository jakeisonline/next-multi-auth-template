import { db } from "@/db"
import { usersTable } from "@/db/schema/users"
import { usersAccountsTable } from "@/db/schema/users_accounts"
import { auth } from "@/lib/auth"
import { UUID } from "@/lib/types"
import { eq, and } from "drizzle-orm"

export async function getUserSession() {
  const session = await auth()

  if (!session) {
    return null
  }

  return session
}

export async function fetchUser(userId: UUID) {
  return db.select().from(usersTable).where(eq(usersTable.id, userId))
}

export async function fetchUserAccounts(userId: UUID) {
  return db
    .select()
    .from(usersAccountsTable)
    .where(eq(usersAccountsTable.userId, userId))
}

export async function fetchUserAccount(userId: UUID, accountId: UUID) {
  return db
    .select()
    .from(usersAccountsTable)
    .where(
      and(
        eq(usersAccountsTable.userId, userId),
        eq(usersAccountsTable.accountId, accountId),
      ),
    )
}
