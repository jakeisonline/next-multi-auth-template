import {
  primaryKey,
  pgTable as table,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core"
import { accountsTable } from "@/db/schema/accounts"
import * as crypto from "crypto"

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
    token: text("token").$defaultFn(() =>
      crypto.randomBytes(12).toString("hex"),
    ),
    type: inviteTokenTypes("type").notNull().default("one_time"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    compositePk: primaryKey({
      columns: [t.accountId, t.token],
    }),
  }),
)
