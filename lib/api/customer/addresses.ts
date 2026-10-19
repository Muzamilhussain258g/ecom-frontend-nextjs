import { apiFetch } from "../client"
import type { Address, CreateAddressPayload } from "@/types/api/order"

export function listAddresses() {
  return apiFetch<Address[]>({
    path: "/addresses",
    auth: true,
    cache: "no-store",
  })
}

export function createAddress(payload: CreateAddressPayload) {
  return apiFetch<Address>({
    path: "/addresses",
    method: "POST",
    body: payload,
    auth: true,
    cache: "no-store",
  })
}

export function getAddress(id: number) {
  return apiFetch<Address>({
    path: `/addresses/${id}`,
    auth: true,
    cache: "no-store",
  })
}

export function updateAddress(id: number, payload: Partial<CreateAddressPayload>) {
  return apiFetch<Address>({
    path: `/addresses/${id}`,
    method: "PATCH",
    body: payload,
    auth: true,
    cache: "no-store",
  })
}

export function deleteAddress(id: number) {
  return apiFetch<unknown>({
    path: `/addresses/${id}`,
    method: "DELETE",
    auth: true,
    cache: "no-store",
  })
}
