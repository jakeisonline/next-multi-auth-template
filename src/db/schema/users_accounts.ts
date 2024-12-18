import { usersTable } from "@/db/schema/users"
import { accountsTable } from "@/db/schema/accounts"
import {
  pgTable as table,
  text,
  timestamp,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core"

export const usersAccountStatuses = pgEnum("user_account_statuses", [
  "pending",
  "active",
  "inactive",
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => ({
    uniqueUsersAccounts: uniqueIndex("unique_users_accounts").on(
      t.userId,
      t.accountId,
    ),
  }),
)
