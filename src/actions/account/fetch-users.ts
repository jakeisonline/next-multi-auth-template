"use server"

import { db } from "@/db"
import { usersTable } from "@/db/schema/users"
import { usersAccountsTable } from "@/db/schema/users_accounts"
import { UUID } from "@/lib/types"
import { eq } from "drizzle-orm"

export async function fetchUsers(accountId: UUID) {
  return db
    .select()
    .from(usersTable)
    .innerJoin(usersAccountsTable, eq(usersAccountsTable.userId, usersTable.id))
    .where(eq(usersAccountsTable.accountId, accountId))
}
