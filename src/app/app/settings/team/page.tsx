import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchUsers } from "@/actions/account/fetch-users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getUserSession } from "@/actions/user/get-user-session"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ClipboardCopy, RefreshCcw, Trash } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tagger, TaggerInput, TaggerTags } from "@/components/ui/tagger"

export default async function TeamSettingsPage() {
  const session = await getUserSession()
  const users = await fetchUsers(session?.user.accountId ?? "")

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-semibold">Team Settings</h2>
      <p className="text-sm text-muted-foreground">
        Manage your team settings here.
      </p>
      <Separator className="my-6" />
      <section className="max-w-3xl">
        <h3 className="text-xl">General Team Settings</h3>
        <div className="mt-4">
          <form action="" className="flex flex-col gap-2">
            <div className="flex flex-col rounded-lg border p-4 gap-2">
              <div className="flex flex-row items-center justify-between">
                <div>
                  <Label
                    htmlFor="global-invite-link"
                    className="text-base font-semibold"
                  >
                    Allow joining via shareable link
                    <span className="text-sm text-muted-foreground block font-normal">
                      Users can register via a shareable link, instead of
                      needing a specific invite.
                    </span>
                  </Label>
                </div>
                <Switch id="global-invite-link" />
              </div>
              <div className="mt-2 relative">
                <Input
                  type="text"
                  value="https://app.getinvite.com/invite/123456"
                  readOnly
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-row gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <ClipboardCopy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy shareable link to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Regenerate shareable link</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-lg border p-4 gap-2">
              <div className="flex flex-row items-center justify-between">
                <div>
                  <Label
                    htmlFor="domain-restrictions"
                    className="text-base font-semibold"
                  >
                    Restrict members to specific domains
                    <span className="text-sm text-muted-foreground block font-normal">
                      Only allow members to join from specific domains.
                    </span>
                  </Label>
                </div>
                <Switch id="domain-restrictions" />
              </div>
              <div className="mt-2">
                <Tagger initialTags={["google.com"]}>
                  <TaggerTags />
                  <TaggerInput id="current-tags" />
                </Tagger>
              </div>
            </div>
          </form>
          <h3 className="text-xl mt-8">Team Members</h3>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.users.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={user.users.image ?? undefined} />
                        <AvatarFallback>JH</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.users.name || "No Name"}
                    </TableCell>
                    <TableCell>{user.users.email}</TableCell>
                    <TableCell className="text-right flex flex-row gap-1">
                      <Select defaultValue={user.users_accounts.role}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-11"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove user from team</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  )
}
