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

export default async function TeamSettingsPage() {
  const users = await fetchUsers("eba6271e-e54d-4511-b76a-0aae14a22315")

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
            <input
              type="hidden"
              name="accountId"
              value="9cc5bc0b-b634-437f-ab7e-9c425cd105b9"
            />
            <input type="hidden" name="type" value="multi_use" />

            <div className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div>
                <Label
                  htmlFor="global-invite-link"
                  className="text-base font-semibold"
                >
                  Allow joining via shareable link
                  <span className="text-sm text-muted-foreground block font-normal">
                    Users can register via a shareable link, instead of needing
                    a specific invite.
                  </span>
                </Label>
              </div>
              <Switch id="global-invite-link" />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
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
                    <TableCell className="text-right">
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
