"use server"

import { db } from "@/db"
import { inviteTokensTable } from "@/db/schema/invite_tokens"
import { usersAccountsTable } from "@/db/schema/users_accounts"
import { auth } from "@/lib/auth"
import { and, or } from "drizzle-orm"
import { ServerActionResponse, UUID } from "@/lib/types"
import { eq } from "drizzle-orm"

export async function doInviteCreate(
  prevState: ServerActionResponse | undefined,
  formData?: FormData,
): Promise<ServerActionResponse> {
  if (!(formData instanceof FormData)) {
    throw new Error("Form data is not a FormData object")
  }

  const session = await auth()

  if (!session) {
    throw new Error("Invite creation requires a signed in user")
  }

  const accountId = formData.get("accountId") as UUID
  const type = formData.get("type") as "one_time" | "multi_use"

  // Check the user creating the invite is an admin for the account
  const userAccounts = await db
    .select()
    .from(usersAccountsTable)
    .where(
      and(
        eq(usersAccountsTable.userId, session.user.id),
        eq(usersAccountsTable.accountId, accountId),
        or(
          eq(usersAccountsTable.role, "admin"),
          eq(usersAccountsTable.role, "owner"),
        ),
      ),
    )

  if (userAccounts.length === 0) {
    throw new Error("User is not an admin or owner for the account")
  }

  console.log("accountId", accountId)

  const invite = await db
    .insert(inviteTokensTable)
    .values({
      accountId,
      type,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    })
    .returning()

  return {
    status: "success",
    data: invite,
  }
}
