import React from 'react'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import Heading from '@/components/Heading'
import Image from 'next/image'
import { TbTrash } from 'react-icons/tb'
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react'
import { BsTrash2Fill } from 'react-icons/bs'
import { PiTrashFill } from 'react-icons/pi'
import { RiCoupon2Line } from 'react-icons/ri'
import Button from '@/components/Button'

export default function CartSection() {
    return (
        <section className='py-10'>
            <div className="container">
                <Breadcrumb>
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

                <Heading text='Your cart' className='py-6 text-left' />
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 items-start relative">
                    <div className="xl:col-span-2 px-6  border rounded-2xl">
                        {
                            [...Array(5)].map((el, i) => (
                                <div className='flex gap-4 border-b py-6' key={i}>
                                    <Image src={"/images/shirt2.png"}
                                        className='w-30'
                                        width={400}
                                        height={400}
                                        alt='shirt'
                                    />
                                    <div className='flex-1'>
                                        <div className='flex justify-between max-sm:gap-3'>
                                            <h3 className='sm:text-[20px] font-satoshi-bold text-primary'>Gradient Graphic T-shirt</h3>
                                            <PiTrashFill size={24} className='text-[#ff3333]' />
                                        </div>
                                        <div className='mt-1 text-sm'>
                                            <span className='text-primary'>Size:</span>
                                            Large
                                        </div>
                                        <div className='text-sm'>
                                            <span className='text-primary'>Color:</span>
                                            Large
                                        </div>
                                        <div className='mt-4 flex justify-between items-center'>
                                            <h3 className='text-lg sm:text-[24px] font-satoshi-bold text-primary'>$240</h3>
                                            <div className='bg-tertiary w-fit py-2 sm:py-3.5 px-3 sm:px-5 rounded-4xl gap-3 flex items-center text-primary'>
                                                <button >
                                                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                                <span>1</span>
                                                <button >
                                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="sticky top-10 border rounded-2xl py-5 px-6">
                        <h3 className='text-[24px] font-satoshi-bold text-primary'>Order Summary</h3>
                        <div className='grid gap-5 mt-6 pb-6 border-b'>
                            <div className='flex text-[20px] justify-between'>
                                <span className=''>Subtotal</span> <span className='text-primary'>$565</span>
                            </div>
                            <div className='flex text-[20px] justify-between'>
                                <span className=''>Discount (-20%)</span> <span className='text-primary'>-$113</span>
                            </div>
                            <div className='flex text-[20px] justify-between '>
                                <span className=''>Delivery Fee</span> <span className='text-primary'>$15</span>
                            </div>
                        </div>
                        <div>
                            <div className='flex text-[20px] justify-between pt-6'>
                                <span className='text-primary'>Total</span> <span className='text-primary'>$565</span>
                            </div>
                            <div className='flex py-6 gap-2 flex-wrap'>
                                <div className='flex-1 flex items-center gap-1 bg-tertiary py-3 px-4 rounded-full'>
                                    <RiCoupon2Line size={24} />
                                    <input type="text" placeholder='Add promo code' className='outline-none border-none w-full' />
                                </div>
                                <Button btnProps={{
                                    text: "Apply",
                                    variant: "black",
                                    // className:"w-full"
                                }} />
                            </div>
                            <Button btnProps={{
                                text: "Go to Checkout",
                                icon: <ArrowRight />,
                                // className='',
                                variant: "black"
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
