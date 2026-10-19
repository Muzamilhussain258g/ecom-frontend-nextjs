import Heading from '@/components/Heading'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export interface BrowseCategoryItem {
    id: number
    name: string
    slug: string
    image: string
}

interface CategorySectionProps {
    categories?: BrowseCategoryItem[]
}

const CategorySection = ({ categories = [] }: CategorySectionProps) => {
    const items = categories.length
        ? categories.slice(0, 4)
        : [
            { id: 1, name: "Casual", slug: "casual", image: "/images/gym.png" },
            { id: 2, name: "Formal", slug: "formal", image: "/images/gym.png" },
            { id: 3, name: "Party", slug: "party", image: "/images/gym.png" },
            { id: 4, name: "Gym", slug: "gym", image: "/images/gym.png" },
          ]

    const spanClass = (index: number) =>
        index === 1 || index === 2 ? "lg:col-span-2 relative bg-secondary h-[290px] overflow-hidden rounded-2xl p-9"
            : "relative bg-secondary h-[290px] overflow-hidden rounded-2xl p-9"

    return (
        <section>
            <div className="container">
                <div className=' mx-auto bg-tertiary py-15 rounded-4xl'>
                    <Heading text='BROWSE BY dress STYLE' />
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3 p-5 lg:p-16'>
                        {items.map((item, index) => (
                            <Link
                                key={item.id}
                                href={`/products?category=${encodeURIComponent(item.slug)}`}
                                className={spanClass(index)}
                            >
                                <h3 className='relative z-1 text-primary font-satoshi-bold text-2xl sm:text-[36px]'>
                                    {item.name}
                                </h3>
                                <Image
                                    src={item.image || "/images/gym.png"}
                                    alt={item.name}
                                    height={400}
                                    width={400}
                                    className='absolute inset-e-0 top-0 '
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategorySection
