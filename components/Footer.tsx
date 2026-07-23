import Link from 'next/link'
import React from 'react'
import { BsFacebook, BsGithub, BsInstagram, BsTwitterX } from 'react-icons/bs'
import { FaFacebook, FaFacebookF } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa6'

const Footer = () => {
    return (
        <footer className='bg-tertiary -mt-23.75 pb-15 pt-35'>
            <div className="container mx-auto grid lg:grid-cols-5 gap-15 lg:gap-28 ">
                <div className='col-span-1'>
                    <h2 className='text-[34px] text-primary leading-5'>SHOP.CO</h2>
                    <p className='mt-6'>We have clothes that suits your style and which you’re proud to wear. From women to men.</p>
                    <div className='text-primary flex gap-4 mt-7'>
                        <span className='bg-secondary p-2 rounded-full border border-border-color'><BsTwitterX /></span>
                        <span className='bg-secondary p-2 rounded-full border border-border-color'><FaFacebookF /></span>
                        <span className='bg-secondary p-2 rounded-full border border-border-color'><BsInstagram /></span>
                        <span className='bg-secondary p-2 rounded-full border border-border-color'><BsGithub /></span>
                    </div>

                </div>
                <div className='lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-y-10'>
                    {footerLinks.map(it => (
                        <div className=''>
                            <h3 className='font-satoshi-medium text-primary'>{it.title}</h3>
                            <div className='mt-6 flex flex-col gap-3'>
                                {it.links.map(link => (
                                    <Link href={link.href}>{link.name}</Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footer


export const footerLinks = [
    {
        title: "COMPANY",
        links: [
            {
                name: "About",
                href: "/about",
            },
            {
                name: "Features",
                href: "/features",
            },
            {
                name: "Works",
                href: "/works",
            },
            {
                name: "Career",
                href: "/career",
            },
        ],
    },
    {
        title: "HELP",
        links: [
            {
                name: "Customer Support",
                href: "/support",
            },
            {
                name: "Delivery Details",
                href: "/delivery",
            },
            {
                name: "Terms & Conditions",
                href: "/terms",
            },
            {
                name: "Privacy Policy",
                href: "/privacy",
            },
        ],
    },
    {
        title: "FAQ",
        links: [
            {
                name: "Account",
                href: "/account",
            },
            {
                name: "Manage Deliveries",
                href: "/deliveries",
            },
            {
                name: "Orders",
                href: "/orders",
            },
            {
                name: "Payments",
                href: "/payments",
            },
        ],
    },
    {
        title: "RESOURCES",
        links: [
            {
                name: "Free eBooks",
                href: "/ebooks",
            },
            {
                name: "Development Tutorial",
                href: "/tutorials",
            },
            {
                name: "How to - Blog",
                href: "/blog",
            },
            {
                name: "Youtube Playlist",
                href: "/youtube",
            },
        ],
    },
];