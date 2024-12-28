"use server"

import { db } from "@/db"
import { usersAccountsTable } from "@/db/schema/users_accounts"
import { auth } from "@/lib/auth"
import { ServerActionResponse } from "@/lib/types"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { fetchUsers } from "@/actions/account/fetch-users"

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

  const users = await fetchUsers(accountId, ["admin", "owner"])

  // Check if the user removing the user is an admin or owner for the account
  if (!users.some((user) => user.users.id === session.user.id)) {
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

  // Check the user being removed is not an owner
  if (
    users.some(
      (user) =>
        user.users.id === userId && user.users_accounts.role === "owner",
    )
  ) {
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

  // Check if the user was removed
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
