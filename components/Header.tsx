import { ChevronDownIcon, Search, ShoppingCartIcon, UserCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const Header = () => {
    return (
        <header className='py-4'>
            <div className='container mx-auto flex items-center justify-between' >
                {/* LOGO */}
                <div>
                    <h1 className='text-[32px] text-primary'>SHOP.CO</h1>
                </div>

                {/* NAVIGATIONS */}
                <div className="flex gap-6 text-primary">
                    {/* <Link href={"/"}>Shop</Link> */}
                    <div className='group relative '>
                        <Link href={"/"} className='flex items-center gap-1'>Shop
                            <ChevronDownIcon
                                size={16}
                                className="transition-transform duration-200 group-hover:rotate-180"
                            />
                        </Link>
                        <div className='absolute hidden flex-col max-w-100 min-w-50 group-hover:flex gap-y-2 border-[#e5e5e5] border p-4 rounded-md'>
                            {["Summer", "Bridal", "Limited Edition", "Trending"].map(el => <Link key={el} href={"/"}>{el}</Link>)} <Link href={"/"}>Summer</Link>
                        </div>
                    </div>
                    <Link href={"/"}>On Sale</Link>
                    <Link href={"/"}>New Arrivals</Link>
                    <Link href={"/"}>Brands</Link>
                </div>

                {/* ACTIONS */}
                <div className='flex items-center gap-10'>
                    {/* Searh bar */}
                    <div className='bg-tertiary flex items-center py-2 px-4 rounded-full gap-1 lg:w-120'>
                        <Search className='text-black/40'/>
                        <input type="text" className='outline-none' />
                    </div>
                    <div className='text-primary flex gap-4'>
                        <Link href={"/"}><ShoppingCartIcon size={24}/></Link>
                        <Link href={"/"}><UserCircle size={24}/></Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header