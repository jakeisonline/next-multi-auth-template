import {
  pgTable as table,
  pgEnum,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const userTypes = pgEnum("user_types", ["admin", "user"])

export const usersTable = table("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: userTypes("type").notNull().default("user"),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
})
