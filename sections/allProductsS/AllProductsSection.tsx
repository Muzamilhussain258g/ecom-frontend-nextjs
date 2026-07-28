import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sliders } from "lucide-react"
import Filters from "@/components/products/Filters"
import ProductCard from "@/components/ProductCard"
import ProductsGrid from "@/components/products/ProductsGrid"

function AllProductsSections() {
    return (
        <section className="py-6 sm:py-10">
            <div className="container">
                <Breadcrumb className="mb-6 sm:mb-10">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/">Home</Link>} />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {/* <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger render={<Button size="icon-sm" variant="ghost"><BreadcrumbEllipsis /><span className="sr-only">Toggle menu</span></Button>} />
                                <DropdownMenuContent align="start">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>Documentation</DropdownMenuItem>
                                        <DropdownMenuItem>Themes</DropdownMenuItem>
                                        <DropdownMenuItem>GitHub</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem> */}
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/">Products</Link>} />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className=" text-primary">Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="relative grid items-start gap-5 md:grid-cols-3 xl:grid-cols-4">
                    <Filters />
                    <ProductsGrid />
                </div>
            </div>
        </section>
    )
}

export default AllProductsSections
