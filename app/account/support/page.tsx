import type { Metadata } from "next"
import { SupportChat } from "@/components/account/SupportChat"

export const metadata: Metadata = {
  title: "Support Chat",
  robots: { index: false, follow: false },
}

export default function SupportChatPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <SupportChat />
    </div>
  )
}
