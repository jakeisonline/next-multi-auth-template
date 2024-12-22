"use server"

import { auth } from "@/lib/auth"
import { ServerActionResponse, UUID } from "@/lib/types"
import { fetchInvite } from "@/actions/invite/fetch-invite"
import { db } from "@/db"
import { usersAccountsTable } from "@/db/schema/users_accounts"
import { inviteTokensTable } from "@/db/schema/invite_tokens"
import { eq } from "drizzle-orm"

export async function doInviteAccept(
  prevState: ServerActionResponse | undefined,
  formData?: FormData,
): Promise<ServerActionResponse> {
  if (!(formData instanceof FormData)) {
    throw new Error("Form data is not a FormData object")
  }

  const session = await auth()

  if (!session) {
    throw new Error("Account setup requires a signed in user")
  }

  if (!formData.get("token")) {
    throw new Error("Token is required")
  }

  const formToken = formData.get("token") as UUID

  const invite = await fetchInvite(formToken)

  if (!invite) {
    throw new Error("Invite not found")
  }

  const createdUsersAccounts = await db.insert(usersAccountsTable).values({
    userId: session.user.id,
    accountId: invite[0].accountId,
    role: "user",
    status: "active",
  })

  if (!createdUsersAccounts) {
    throw new Error("Failed to create users accounts")
  }

  if (invite[0].type === "one_time") {
    const deletedInvite = await db
      .delete(inviteTokensTable)
      .where(eq(inviteTokensTable.token, formToken))

    if (!deletedInvite) {
      throw new Error("Failed to delete invite")
    }

    console.info(
      `Invite ${formToken} deleted due to one_time use, user ${session.user.id} accepted`,
    )
  }

  return {
    status: "success",
  }
}
