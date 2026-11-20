import type { ListProductsParams } from "@/types/api/product"
import { ApiError } from "./errors"

export function parseProductQuery(input: Record<string, string | string[] | undefined>): ListProductsParams {
  const value = (key: string) => {
    const raw = input[key]
    if (Array.isArray(raw)) throw new ApiError("Use only one value for " + key, 400)
    return raw?.trim()
  }
  const number = (key: string, fallback?: number) => {
    const raw = value(key)
    if (raw === undefined || raw === "") return fallback
    const parsed = Number(raw)
    if (!Number.isFinite(parsed) || parsed < 0) throw new ApiError("Invalid " + key, 400)
    return parsed
  }
  const page = number("page", 1) ?? 1
  const limit = number("limit", 12) ?? 12
  if (!Number.isInteger(page) || page < 1) throw new ApiError("Page must be a positive integer.", 400)
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new ApiError("Limit must be between 1 and 100.", 400)
  const minPrice = number("minPrice")
  const maxPrice = number("maxPrice")
  for (const price of [minPrice, maxPrice]) {
    if (price !== undefined && Math.abs(price * 100 - Math.round(price * 100)) > 1e-7) {
      throw new ApiError("Prices must have at most two decimal places.", 400)
    }
  }
  if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
    throw new ApiError("Maximum price must be at least the minimum price.", 400)
  }
  const search = value("search") || undefined
  const category = value("category")?.toLowerCase() || undefined
  if ((search?.length ?? 0) > 100 || (category?.length ?? 0) > 100) {
    throw new ApiError("Search and category must be at most 100 characters.", 400)
  }
  const sortBy = value("sortBy") ?? "createdAt"
  const sortOrder = value("sortOrder") ?? "desc"
  if (sortBy !== "name" && sortBy !== "price" && sortBy !== "createdAt") throw new ApiError("Invalid sort field.", 400)
  if (sortOrder !== "asc" && sortOrder !== "desc") throw new ApiError("Invalid sort order.", 400)
  const stock = value("inStock")
  if (stock !== undefined && stock !== "" && stock !== "true" && stock !== "false") throw new ApiError("Invalid stock filter.", 400)
  return { page, limit, search, category, minPrice, maxPrice, sortBy, sortOrder,
    inStock: stock === "true" ? true : stock === "false" ? false : undefined }
}
