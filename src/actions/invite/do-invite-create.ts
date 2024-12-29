"use server"

import { db } from "@/db"
import { inviteTokensTable } from "@/db/schema/invite_tokens"
import { auth } from "@/lib/auth"
import { ServerActionResponse, UUID } from "@/lib/types"
import { fetchUsers } from "../account/fetch-users"
import { Resend } from "resend"
import { z } from "zod"

export async function doInviteCreate(
  prevState: ServerActionResponse | undefined,
  formData?: FormData,
): Promise<ServerActionResponse> {
  if (!(formData instanceof FormData)) {
    throw new Error("Form data is not a FormData object")
  }

  const session = await auth()

  if (!session) {
    throw new Error("Invite creation requires a signed in user")
  }

  const accountId = formData.get("accountId") as UUID
  const type = formData.get("type") as "one_time" | "multi_use"
  const email = formData.get("email") as string

  // Check the email address is valid using zod
  if (!z.string().email().safeParse(email).success) {
    return {
      status: "error",
      data: {
        email,
      },
      messages: [
        {
          title: "Invite was not created",
          body: "The email address is not valid.",
        },
      ],
    }
  }

  const users = await fetchUsers(accountId, ["admin", "owner"])

  // Check if the user creating an invite is an admin or owner for the account
  if (!users.some((user) => user.users.id === session.user.id)) {
    return {
      status: "error",
      data: {
        email,
      },
      messages: [
        {
          title: "Invite was not created",
          body: "You are not an admin or owner for the account.",
        },
      ],
    }
  }

  const invite = await db
    .insert(inviteTokensTable)
    .values({
      accountId,
      type,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    })
    .returning()

  if (!invite) {
    return {
      status: "error",
      data: {
        email,
      },
      messages: [
        {
          title: "Invite was not created",
          body: "An error occurred while creating the invite.",
        },
      ],
    }
  }

  const EmailClient = new Resend(process.env.RESEND_API_KEY)

  const { error } = await EmailClient.emails.send({
    from: "next-multi-auth-template <me@jakeisonline.com>",
    to: email,
    subject: "Invite to join the team",
    html: `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite[0].token}">here</a> to join the team.</p>`,
  })

  if (error) {
    return {
      status: "error",
      data: {
        email,
      },
      messages: [
        {
          title: "Invite was not created",
          body: "An error occurred while sending the invite.",
        },
      ],
    }
  }

  return {
    status: "success",
    data: invite,
  }
}
