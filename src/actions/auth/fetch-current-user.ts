import { db } from "@/db"
import { usersTable } from "@/db/schema/users"
import { eq, sql } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { usersAccountsTable } from "@/db/schema/users_accounts"
import { accountsTable } from "@/db/schema/accounts"

export async function fetchCurrentUser() {
  const session = await auth()

  if (!session) {
    return null
  }

  const rawResults = await db
    .select({
      // User fields
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      image: usersTable.image,
      // Account fields
      accountId: accountsTable.id,
      accountName: accountsTable.name,
      accountRole: usersAccountsTable.role,
      accountStatus: usersAccountsTable.status,
    })
    .from(usersTable)
    .leftJoin(usersAccountsTable, eq(usersTable.id, usersAccountsTable.userId))
    .leftJoin(accountsTable, eq(usersAccountsTable.accountId, accountsTable.id))
    .where(eq(usersTable.id, session.user.id))

  const userWithAccounts = rawResults.reduce(
    (acc, row) => {
      if (!acc.id) {
        acc = {
          id: row.id,
          name: row.name,
          email: row.email,
          image: row.image,
          accounts: [],
        }
      }

      if (row.accountId) {
        acc.accounts.push({
          id: row.accountId,
          name: row.accountName,
          role: row.accountRole,
          status: row.accountStatus,
        })
      }

      return acc
    },
    {} as {
      id: string
      name: string | null
      email: string | null
      image: string | null
      accounts: {
        id: string
        name: string | null
        role: string | null
        status: string | null
      }[]
    },
  )

  return userWithAccounts
}

export type FetchCurrentUserResponse = Awaited<
  ReturnType<typeof fetchCurrentUser>
>
