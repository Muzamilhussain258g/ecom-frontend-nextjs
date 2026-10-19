"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  Home,
  LogOut,
  MapPin,
  Package,
  ShoppingCart,
  UserRound,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { signOutAction } from "@/actions/auth"

const navItems = [
  { title: "Profile", href: "/account", icon: UserRound },
  { title: "Cart", href: "/account/cart", icon: ShoppingCart },
  { title: "Orders", href: "/account/orders", icon: Package },
  { title: "Addresses", href: "/account/addresses", icon: MapPin },
  { title: "Wishlist", href: "/account/wishlist", icon: Heart },
]

export function AccountAppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/account") return pathname === "/account"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <Sidebar
      collapsible="icon"
      className="!absolute !inset-y-0 !top-0 !h-full"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Account</span>
                <span className="truncate text-xs text-muted-foreground">Manage your store</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={active}
                      render={<Link href={item.href} />}
                      className={
                        active
                          ? "bg-primary text-primary-foreground data-active:bg-primary data-active:text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOutAction} className="w-full">
              <SidebarMenuButton tooltip="Sign out" type="submit" className="w-full">
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
