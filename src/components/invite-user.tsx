"use client"

import { useActionState, useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import { doInviteCreate } from "@/actions/invite/do-invite-create"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { UUID } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function InviteUser({ accountId }: { accountId: UUID }) {
  const [state, formAction, isPending] = useActionState(
    doInviteCreate,
    undefined,
  )
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [email, setEmail] = useState<string | undefined>(undefined)

  const handleOpenChange = (isOpening: boolean) => {
    // Prevents UI shift when closing the dialog that has an error
    if (isOpening) {
      setError(undefined)
    }

    setOpen(isOpening)
  }

  useEffect(() => {
    if (state?.status === "success") {
      setOpen(false)
    }

    if (state?.status === "error") {
      setError(state.messages?.[0]?.body)
    }

    // @ts-expect-error - TODO: state.data is not typed
    setEmail(state?.data?.email)
  }, [state])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Invite new member</Button>
      </DialogTrigger>

      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="accountId" value={accountId} />
          <input type="hidden" name="type" value="one_time" />
          <DialogHeader>
            <DialogTitle>Invite a new user to the team</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Entering an email address will send an invite to the user to join
            this account.
            {error && !isPending && (
              <Alert variant="destructive" className="mt-2 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-semibold">
                  {state?.messages?.[0]?.title}
                </AlertTitle>
                <AlertDescription>
                  {state?.messages?.[0]?.body}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <Label htmlFor="email" className="sr-only">
                Email address of new user
              </Label>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </div>
          </DialogDescription>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="secondary" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
