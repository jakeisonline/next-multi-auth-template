"use server"

import { db } from "@/db"
import { usersTable } from "@/db/schema/users"
import { UUID } from "@/lib/types"
import { eq } from "drizzle-orm"

export async function fetchUser(userId: UUID) {
  return db.select().from(usersTable).where(eq(usersTable.id, userId))
}
