import { Card, CardContent } from "@/components/ui/card"

export default function VerifyPage() {
  return (
    <Card className="mx-auto w-[24rem]">
      <CardContent>
        <div className="text-center pt-10">
          <span className="text-8xl">🎉</span>
          <p className="mt-6">
            Check your inbox (and maybe your spam folder) for a link.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
