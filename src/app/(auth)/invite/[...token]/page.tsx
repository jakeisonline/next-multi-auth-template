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
import { Button } from "@/components/ui/button"

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: UUID }>
}) {
  const session = await getUserSession()

  if (!session) {
    throw new Error("You must be signed in to accept an invite")
  }

  const token = await (await params).token
  const invite = await fetchInvite(token[0])

  if (invite.length === 0) {
    throw new Error("Invite not found with token: " + token[0])
  }

  // Check if current user is already a member of the account
  const userAccount = await fetchUserAccount(
    session.user.id,
    invite[0].accountId,
  )

  if (userAccount.length > 0) {
    throw new Error("User already a member of this account")
  }

  const account = await fetchAccount(invite[0].accountId)

  if (account.length === 0) {
    throw new Error("Account not found with id: " + invite[0].accountId)
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
        <Button className="w-full">Join {account[0].name}</Button>
      </CardContent>
    </Card>
  )
}
