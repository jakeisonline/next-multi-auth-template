"use server"

import { db } from "@/db"
import { usersAccountsTable } from "@/db/schema/users_accounts"
import { auth } from "@/lib/auth"
import { ServerActionResponse } from "@/lib/types"
import { eq, and, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function doRemoveUser(
  prevState: ServerActionResponse | undefined,
  formData?: FormData,
): Promise<ServerActionResponse> {
  if (!(formData instanceof FormData)) {
    throw new Error("Form data is not a FormData object")
  }

  const session = await auth()

  if (!session) {
    throw new Error("Removal of users requires a signed in user")
  }

  const userId = formData.get("userId") as string
  const accountId = formData.get("accountId") as string

  // Check the user removing the user is an admin or owner for the account
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
    return {
      status: "error",
      messages: [
        {
          title: "User was not removed",
          body: "You are not an admin or owner for the account.",
        },
      ],
    }
  }

  if (userAccounts[0].role === "owner") {
    return {
      status: "error",
      messages: [
        {
          title: "User was not removed",
          body: "Owner of the account cannot be removed.",
        },
      ],
    }
  }

  const user = await db
    .delete(usersAccountsTable)
    .where(
      and(
        eq(usersAccountsTable.userId, userId),
        eq(usersAccountsTable.accountId, accountId),
      ),
    )

  if (user.rowCount === 0) {
    return {
      status: "error",
      messages: [
        {
          title: "User was not removed",
          body: "The user you are trying to remove may have already been removed.",
        },
      ],
    }
  }

  revalidatePath("/app/settings/team")

  return {
    status: "success",
  }
}
