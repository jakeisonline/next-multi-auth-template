import {
  primaryKey,
  pgTable as table,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core"
import { accountsTable } from "@/db/schema/accounts"

export const inviteTokenTypes = pgEnum("invite_token_types", [
  "one_time",
  "multi_use",
])

export const inviteTokensTable = table(
  "invite_tokens",
  {
    accountId: text("account_id")
      .notNull()
      .references(() => accountsTable.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    type: inviteTokenTypes("type").notNull().default("one_time"),
    expires: timestamp("expires").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    compositePk: primaryKey({
      columns: [t.accountId, t.token],
    }),
  }),
)
