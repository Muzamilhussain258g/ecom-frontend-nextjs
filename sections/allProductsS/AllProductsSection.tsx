import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Filters from "@/components/products/Filters"
import ProductsGrid from "@/components/products/ProductsGrid"
import type { ProductCardData } from "@/components/ProductCard"

interface AllProductsSectionsProps {
    products: ProductCardData[]
    title?: string
    page?: number
    totalPages?: number
    total?: number
    limit?: number
    categorySlug?: string
}

function AllProductsSections({
    products,
    title = "Casual",
    page = 1,
    totalPages = 1,
    total = 0,
    limit = 12,
    categorySlug,
}: AllProductsSectionsProps) {
    return (
        <section className="py-6 sm:py-10">
            <div className="container">
                <Breadcrumb className="mb-6 sm:mb-10">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/">Home</Link>} />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/products">Products</Link>} />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className=" text-primary">
                                {categorySlug || title}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="relative grid items-start gap-5 md:grid-cols-3 xl:grid-cols-4">
                    <Filters />
                    <ProductsGrid
                        products={products}
                        title={title}
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        limit={limit}
                    />
                </div>
            </div>
        </section>
    )
}

export default AllProductsSections
