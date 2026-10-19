import type { Metadata } from "next"
import { AccountAppSidebar } from "@/components/account/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-20 flex overflow-hidden bg-background sm:top-[76px]">
      <SidebarProvider
        defaultOpen
        className="!min-h-0 !h-full max-h-full flex-1 overflow-hidden"
      >
        <AccountAppSidebar />
        <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 !h-4" />
            <p className="text-sm text-muted-foreground">My account</p>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 text-left md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
