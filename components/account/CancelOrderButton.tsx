"use client"

import { useTransition } from "react"
import Button from "@/components/Button"
import type { OrderActionResult } from "@/actions/orders"

export function CancelOrderButton({
  orderId,
  cancelOrderAction,
}: {
  orderId: number
  cancelOrderAction: (id: number) => Promise<OrderActionResult>
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      btnProps={{
        text: pending ? "Cancelling..." : "Cancel order",
        variant: "white",
        onClick: () =>
          startTransition(async () => {
            await cancelOrderAction(orderId)
          }),
      }}
    />
  )
}
