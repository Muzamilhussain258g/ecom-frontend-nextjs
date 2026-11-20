import type { ProductCardData } from "@/components/ProductCard"
import type { CategoryNode } from "@/types/api/category"
import type { Cart, CartItem } from "@/types/api/cart"
import type { ProductDetail, ProductListItem, ProductVariant } from "@/types/api/product"
import type { ReviewCardProps } from "@/components/ReviewCard"

const PLACEHOLDER_IMAGE = "/images/shirt.png"

const COLOR_NAME_TO_HEX: Record<string, string> = {
  red: "#EF4444",
  blue: "#3B82F6",
  black: "#111827",
  white: "#FFFFFF",
  green: "#10B981",
  yellow: "#FBBF24",
  pink: "#EC4899",
  purple: "#8B5CF6",
  orange: "#F97316",
  gray: "#6B7280",
  grey: "#6B7280",
  navy: "#1E3A8A",
  brown: "#78350F",
  beige: "#F5F5DC",
  cream: "#FFFDD0",
  khaki: "#C3B091",
  olive: "#556B2F",
  maroon: "#800000",
  teal: "#14B8A6",
  silver: "#CBD5E1",
  gold: "#EAB308",
  charcoal: "#334155",
  coral: "#FF7F50",
  burgundy: "#800020",
  lavender: "#E6E6FA",
  tan: "#D2B48C",
  cyan: "#06B6D4",
  indigo: "#6366F1",
}

export function resolveColorHex(
  value?: string | null,
  code?: string | null,
  metadata?: Record<string, unknown> | null,
): string {
  const meta = metadata as { hex?: string; color?: string } | null
  if (meta?.hex && typeof meta.hex === "string") return meta.hex
  if (meta?.color && typeof meta.color === "string") return meta.color

  const normalizedCode = code?.trim().toLowerCase()
  if (normalizedCode && COLOR_NAME_TO_HEX[normalizedCode]) {
    return COLOR_NAME_TO_HEX[normalizedCode]
  }

  const normalizedVal = value?.trim().toLowerCase()
  if (normalizedVal && COLOR_NAME_TO_HEX[normalizedVal]) {
    return COLOR_NAME_TO_HEX[normalizedVal]
  }

  if (normalizedCode?.startsWith("#")) return normalizedCode
  if (normalizedVal?.startsWith("#")) return normalizedVal

  return "#111827"
}

export function isLightColor(colorHex: string): boolean {
  const lower = colorHex.toLowerCase()
  if (
    ["#ffffff", "#fff", "white", "#f5f5dc", "#fffdd0", "#e6e6fa", "beige", "cream"].includes(
      lower,
    )
  ) {
    return true
  }
  if (lower.startsWith("#") && lower.length === 7) {
    const r = parseInt(lower.slice(1, 3), 16)
    const g = parseInt(lower.slice(3, 5), 16)
    const b = parseInt(lower.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 180
  }
  return false
}

export interface NormalizedVariantOptionValue {
  id: number
  label: string
  code: string
  hex?: string
  isLight?: boolean
  sortOrder?: number
}

export interface NormalizedVariantOptionGroup {
  id: number
  name: string
  slug: string
  isColor: boolean
  displayTitle: string
  sortOrder?: number
  values: NormalizedVariantOptionValue[]
}

export function getProductVariantGroups(product: ProductDetail): NormalizedVariantOptionGroup[] {
  if (product.variantOptions && product.variantOptions.length > 0) {
    return [...product.variantOptions]
      .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id))
      .map((option) => {
        const isColor =
          /color|colour/i.test(option.name) || /color|colour/i.test(option.slug)
        const displayTitle = isColor
          ? "Select Colors"
          : /size/i.test(option.name)
            ? "Choose Size"
            : `Choose ${option.name}`

        const values = (option.values || []).map((val) => {
          const hex = isColor
            ? resolveColorHex(val.value, val.code, val.metadata)
            : undefined
          return {
            id: val.id,
            label: val.value,
            code: val.code,
            hex,
            isLight: hex ? isLightColor(hex) : false,
            sortOrder: val.sortOrder,
          }
        })

        return {
          id: option.id,
          name: option.name,
          slug: option.slug,
          isColor,
          displayTitle,
          sortOrder: option.sortOrder,
          values,
        }
      })
  }

  // Fallback: extract variant types from product.variants if variantOptions is empty
  const groupMap = new Map<number, NormalizedVariantOptionGroup>()
  for (const variant of product.variants || []) {
    for (const val of variant.values || []) {
      const typeId = val.variantType?.id ?? 0
      const typeName = val.variantType?.name || "Option"
      const typeSlug = val.variantType?.slug || typeName.toLowerCase()
      const isColor =
        /color|colour/i.test(typeName) || /color|colour/i.test(typeSlug)

      if (!groupMap.has(typeId)) {
        groupMap.set(typeId, {
          id: typeId,
          name: typeName,
          slug: typeSlug,
          isColor,
          displayTitle: isColor
            ? "Select Colors"
            : /size/i.test(typeName)
              ? "Choose Size"
              : `Choose ${typeName}`,
          sortOrder: val.variantType?.sortOrder,
          values: [],
        })
      }

      const group = groupMap.get(typeId)!
      if (!group.values.some((v) => v.id === val.id)) {
        const hex = isColor
          ? resolveColorHex(val.value, val.code, val.metadata)
          : undefined
        group.values.push({
          id: val.id,
          label: val.value,
          code: val.code,
          hex,
          isLight: hex ? isLightColor(hex) : false,
          sortOrder: val.sortOrder,
        })
      }
    }
  }

  return Array.from(groupMap.values()).sort(
    (a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id),
  )
}

export function findMatchingVariant(
  variants: ProductVariant[] | undefined,
  selectedOptions: Record<number, number>,
): ProductVariant | null {
  if (!variants || variants.length === 0) return null

  const selectedValueIds = Object.values(selectedOptions).filter(
    (id): id is number => typeof id === "number",
  )

  if (selectedValueIds.length === 0) return variants[0] || null

  // 1. Exact match where every value in the variant matches selected options
  const matchingVariants = variants.filter((variant) => {
    if (!variant.values || variant.values.length === 0) return false
    return variant.values.every((v) => {
      const typeId = v.variantType?.id
      if (typeId && selectedOptions[typeId] !== undefined) {
        return selectedOptions[typeId] === v.id
      }
      return selectedValueIds.includes(v.id)
    })
  })

  if (matchingVariants.length === 1) {
    return matchingVariants[0]
  }

  if (matchingVariants.length > 1) {
    const inStock = matchingVariants.find((v) => v.isActive && v.stock > 0)
    return inStock || matchingVariants[0]
  }

  // 2. Best fallback match with maximum matching values
  let bestVariant: ProductVariant | null = null
  let maxMatches = -1

  for (const variant of variants) {
    const matchCount = (variant.values || []).filter((v) => {
      const typeId = v.variantType?.id
      if (typeId && selectedOptions[typeId] !== undefined) {
        return selectedOptions[typeId] === v.id
      }
      return selectedValueIds.includes(v.id)
    }).length

    if (matchCount > maxMatches) {
      maxMatches = matchCount
      bestVariant = variant
    }
  }

  return bestVariant || variants[0] || null
}

function toNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER_IMAGE
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }
  return PLACEHOLDER_IMAGE
}

export function mapProductToCard(
  product: ProductListItem | ProductDetail | {
    isWishlisted?: boolean
    id: number
    name: string
    slug: string
    basePrice: string | number
    images?: Array<{ media?: { url?: string } }>
    productCategories?: Array<{ category: { categoryName: string } }>
    reviews?: { averageRating?: number; totalReviews?: number }
  },
): ProductCardData {
  const image =
    "images" in product && product.images?.[0]?.media?.url
      ? resolveMediaUrl(product.images[0].media.url)
      : PLACEHOLDER_IMAGE

  const categoryName =
    "productCategories" in product && product.productCategories?.[0]?.category?.categoryName
      ? product.productCategories[0].category.categoryName
      : "Products"

  const rating =
    "reviews" in product && product.reviews && "averageRating" in product.reviews
      ? Number(product.reviews.averageRating ?? 0)
      : 0

  const reviews =
    "reviews" in product && product.reviews && "totalReviews" in product.reviews
      ? Number(product.reviews.totalReviews ?? 0)
      : 0

  return {
    isWishlisted: product.isWishlisted,
    id: product.id,
    name: product.name,
    slug: product.slug,
    image,
    rating,
    reviews,
    price: toNumber(product.basePrice),
    oldPrice: null,
    discount: null,
    category: categoryName,
  }
}

export function mapCategoryToBrowseItem(category: CategoryNode) {
  return {
    id: category.id,
    name: category.categoryName,
    slug: category.slug,
    image: resolveMediaUrl(category.media?.media?.url) || "/images/gym.png",
  }
}

export function mapReviewToCard(review: {
  stars: number
  review: string
  user?: { name?: string }
  createdAt?: string
}): ReviewCardProps {
  return {
    rating: review.stars,
    username: review.user?.name || "Customer",
    review: review.review,
    dateOfReview: review.createdAt,
  }
}

export function mapCartItemForUi(item: CartItem) {
  const image = resolveMediaUrl(item.variant.product.images?.[0]?.media?.url)
  const price = toNumber(item.variant.price)
  const optionLabels = item.variant.combinationKey
    ?.split("|")
    .filter(Boolean)
    .join(" / ")

  return {
    id: item.id,
    variantId: item.variantId,
    name: item.variant.product.name,
    slug: item.variant.product.slug,
    image,
    price,
    quantity: item.buyingQuantity,
    isSelected: item.isSelected,
    sizeLabel: optionLabels || item.variant.sku,
    colorLabel: "",
    itemTotal: item.itemTotal,
    stock: item.variant.stock,
  }
}

export function mapCartSummary(cart: Cart) {
  return {
    subtotal: cart.summary.subtotal,
    discount: 0,
    deliveryFee: cart.summary.selectedItemsCount > 0 ? 15 : 0,
    total: Number(
      (cart.summary.subtotal + (cart.summary.selectedItemsCount > 0 ? 15 : 0)).toFixed(2),
    ),
    totalItems: cart.summary.totalItems,
    selectedItemsCount: cart.summary.selectedItemsCount,
  }
}

export function getProductGalleryImages(product: ProductDetail): string[] {
  const urls = product.images
    .map((img) => resolveMediaUrl(img.media?.url))
    .filter(Boolean)
  return urls.length ? urls : [PLACEHOLDER_IMAGE]
}

export function getColorOptions(product: ProductDetail) {
  const colorOption = product.variantOptions.find((opt) =>
    /color|colour/i.test(opt.name) || /color|colour/i.test(opt.slug),
  )
  if (!colorOption) return []
  return colorOption.values.map((value) => {
    return {
      id: value.id,
      label: value.value,
      code: value.code,
      hex: resolveColorHex(value.value, value.code, value.metadata),
    }
  })
}

export function getSizeOptions(product: ProductDetail) {
  const sizeOption = product.variantOptions.find((opt) =>
    /size/i.test(opt.name) || /size/i.test(opt.slug),
  )
  if (!sizeOption) {
    return product.variantOptions
      .filter((opt) => !/color|colour/i.test(opt.name))
      .flatMap((opt) =>
        opt.values.map((value) => ({
          id: value.id,
          label: value.value,
          code: value.code,
          typeId: opt.id,
        })),
      )
  }
  return sizeOption.values.map((value) => ({
    id: value.id,
    label: value.value,
    code: value.code,
    typeId: sizeOption.id,
  }))
}
