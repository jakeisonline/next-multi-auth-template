"use server"

import { auth } from "@/lib/auth"

export async function getUserSession() {
  const session = await auth()

  if (!session) {
    return null
  }

  return session
}
