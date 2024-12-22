"use server"

/**
 * Fetches a valid (non-expired) invite from the database.
 *
 * @param {UUID} token - The unique identifier for the invite token.
 * @returns {Promise<any>} A promise that resolves to the invite token data if found, or an empty array if not.
 */

import { db } from "@/db"
import { inviteTokensTable } from "@/db/schema/invite_tokens"
import { UUID } from "@/lib/types"
import { eq, gte, and } from "drizzle-orm"

export async function fetchInvite(token: UUID) {
  const currentTimestamp = new Date().getTime()

  return db
    .select()
    .from(inviteTokensTable)
    .where(
      and(
        eq(inviteTokensTable.token, token),
        gte(inviteTokensTable.expiresAt, new Date(currentTimestamp)),
      ),
    )
}
