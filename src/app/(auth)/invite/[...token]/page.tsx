import { fetchInvite } from "@/actions/invite/fetch-invite"
import { fetchUserAccount } from "@/actions/user/fetch-user-account"
import { getUserSession } from "@/actions/user/get-user-session"
import { fetchAccount } from "@/actions/account/fetch-account"
import { UUID } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { notFound } from "next/navigation"
import { AcceptInviteButton } from "@/components/accept-invite-button"

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: UUID }>
}) {
  const session = await getUserSession()

  if (!session) {
    throw new Error("You must be signed in to accept an invite")
  }

  const token = (await params).token
  const invite = await fetchInvite(token[0])

  // If the invite is not found, return a 404
  if (invite.length === 0) {
    console.warn(`Invite not found with token: ${token[0]}`)
    notFound()
  }

  // Check if current user is already a member of the account
  const userAccount = await fetchUserAccount(
    session.user.id,
    invite[0].accountId,
  )

  // If the user is already a member of the account, error
  // TODO: Redirect to the account page instead of throwing an error
  if (userAccount.length > 0) {
    console.info(
      `User already a member of account (${invite[0].accountId}) with invite token (${token[0]})`,
    )
    notFound()
  }

  const account = await fetchAccount(invite[0].accountId)

  // If the account is not found, return a 404
  if (account.length === 0) {
    console.warn(
      `Legit invite token found (${token[0]}), but account not found (${invite[0].accountId})`,
    )
    notFound()
  }

  return (
    <Card className="mx-auto w-[24rem]">
      <CardHeader>
        <CardTitle className="text-2xl">{account[0].name}</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join this account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AcceptInviteButton token={token[0]}>
          Join {account[0].name}
        </AcceptInviteButton>
      </CardContent>
    </Card>
  )
}
