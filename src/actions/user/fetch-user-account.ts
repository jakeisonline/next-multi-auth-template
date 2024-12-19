"use server"

import { and, eq } from "drizzle-orm"
import { usersAccountsTable } from "@/db/schema/users_accounts"
import { db } from "@/db"
import { UUID } from "@/lib/types"

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
