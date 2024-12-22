"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useActionState, useEffect } from "react"
import { doInviteAccept } from "@/actions/invite/do-invite-accept"
import { UUID } from "@/lib/types"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function AcceptInviteButton({
  token,
  className,
  children,
  ...props
}: {
  token: UUID
  className?: string
  children: React.ReactNode
}) {
  const [state, formAction] = useActionState(doInviteAccept, undefined)
  const router = useRouter()

  useEffect(() => {
    if (state?.status === "success") {
      router.push("/app")
    }
  }, [state])

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <AcceptInviteStatefulButton
        className={cn("w-full", className)}
        disabled={state?.status === "success"}
        {...props}
      >
        {children}
      </AcceptInviteStatefulButton>
    </form>
  )
}

function AcceptInviteStatefulButton({
  className,
  children,
  disabled,
  ...props
}: {
  className?: string
  disabled?: boolean
  children: React.ReactNode
}) {
  const { pending } = useFormStatus()

  const isDisabled = pending || disabled ? true : false

  return (
    <Button
      className={cn("w-full", className)}
      {...props}
      disabled={isDisabled}
    >
      {isDisabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
