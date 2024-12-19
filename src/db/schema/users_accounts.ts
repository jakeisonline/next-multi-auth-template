import { usersTable } from "@/db/schema/users"
import { accountsTable } from "@/db/schema/accounts"
import {
  pgTable as table,
  text,
  timestamp,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core"
import { eq, sql } from "drizzle-orm"

export const usersAccountStatuses = pgEnum("user_account_statuses", [
  "pending",
  "active",
  "inactive",
])

export const userAccountsRoles = pgEnum("user_account_roles", [
  "owner",
  "admin",
  "user",
])

export const usersAccountsTable = table(
  "users_accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => usersTable.id),
    accountId: text("account_id").references(() => accountsTable.id),
    status: usersAccountStatuses("status").notNull().default("pending"),
    role: userAccountsRoles("role").notNull().default("user"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueUsersAccounts: uniqueIndex("unique_users_accounts").on(
      t.userId,
      t.accountId,
    ),
    uniqueOwnersAccounts: uniqueIndex("unique_owners_accounts")
      .on(t.accountId, t.role)
      // cf. https://github.com/drizzle-team/drizzle-orm/issues/3349#issuecomment-2452165710
      .where(eq(t.role, sql`'owner'`)),
  }),
)
