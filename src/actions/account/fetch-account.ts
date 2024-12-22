"use server"

/**
 * Fetches an account from the database by its unique identifier.
 *
 * @param {UUID} accountId - The unique identifier of the account to fetch.
 * @returns {Promise<Account | null>} A promise that resolves to the account object if found, or null if not.
 */

import { db } from "@/db"
import { accountsTable } from "@/db/schema/accounts"
import { UUID } from "@/lib/types"
import { eq } from "drizzle-orm"

export async function fetchAccount(accountId: UUID) {
  return db.select().from(accountsTable).where(eq(accountsTable.id, accountId))
}
