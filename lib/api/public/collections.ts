import { apiFetch, apiFetchSafe } from "../client"
import type { Collection } from "@/types/api/collection"

export async function listCollections() {
  return apiFetchSafe<Collection[]>(
    {
      path: "/collections",
      revalidate: 120,
      tags: ["collections"],
    },
    [],
  )
}

export async function getCollectionBySlug(slug: string) {
  return apiFetch<Collection>({
    path: `/collections/${slug}`,
    revalidate: 120,
    tags: ["collections", `collection:${slug}`],
  })
}

export async function getCollectionBySlugSafe(slug: string) {
  try {
    return await getCollectionBySlug(slug)
  } catch {
    return null
  }
}
