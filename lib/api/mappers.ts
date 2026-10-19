import type { ProductCardData } from "@/components/ProductCard"
import type { CategoryNode } from "@/types/api/category"
import type { Cart, CartItem } from "@/types/api/cart"
import type { ProductDetail, ProductListItem } from "@/types/api/product"
import type { ReviewCardProps } from "@/components/ReviewCard"

const PLACEHOLDER_IMAGE = "/images/shirt.png"

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
    const meta = value.metadata as { hex?: string; color?: string } | null
    return {
      id: value.id,
      label: value.value,
      code: value.code,
      hex: meta?.hex || meta?.color || undefined,
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
