"use server"

import { db } from "@/db"
import { accountsTable } from "@/db/schema/accounts"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { ServerActionResponse } from "@/lib/types"
import { usersAccountsTable } from "@/db/schema/users_accounts"

export async function doAccountSetup(
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

  const validatedAccountName = z
    .string({
      required_error: "required_error",
      invalid_type_error: "invalid_type_error",
    })
    .trim()
    .safeParse(formData.get("account_name"))

  const currentUserId = session.user.id
  const accountName = formData.get("account_name")

  if (!validatedAccountName.success) {
    throw new Error("No account name was provided, or type is invalid")
  }

  const createdAccount = await db
    .insert(accountsTable)
    .values({
      name: accountName as string,
    })
    .returning()

  if (!createdAccount[0].id) {
    throw new Error("Failed to create account")
  }

  const createdUserAccount = await db
    .insert(usersAccountsTable)
    .values({
      userId: currentUserId,
      accountId: createdAccount[0].id,
      role: "owner",
      status: "active",
    })
    .returning()

  if (!createdUserAccount[0].id) {
    throw new Error("Failed to update user account")
  }

  return {
    status: "success",
  }
}
