"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { AccountSwitcher } from "@/components/account-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { User } from "next-auth"
import { FetchCurrentUserResponse } from "@/actions/auth/fetch-current-user"

// This is sample data.
const data = {
  accounts: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
    },
    {
      name: "Evil Corp.",
      logo: Command,
    },
  ],
  navMain: [
    {
      title: "Products",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Active",
          url: "#",
        },
        {
          title: "Inactive",
          url: "#",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Unfulfilled",
          url: "#",
        },
        {
          title: "Fulfilled",
          url: "#",
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Inactive",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({
  currentUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  currentUser: NonNullable<FetchCurrentUserResponse>
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AccountSwitcher accounts={currentUser.accounts} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
