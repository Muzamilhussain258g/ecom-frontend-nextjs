"use client"

import {
  ChevronDownIcon,
  Menu,
  Search,
  ShoppingCartIcon,
  UserCircle,
  X,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const shopCategories = ["Summer", "Bridal", "Limited Edition", "Trending"]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsShopOpen(false)
  }

  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu()

      if (event.key === "Tab") {
        const focusableElements =
          mobileMenuRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled])',
          )

        if (!focusableElements?.length) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener("keydown", closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
      menuButton?.focus()
    }
  }, [isMenuOpen])

  return (
    <header className="relative z-40 border-b border-black/10 bg-white">
      <div className="container flex h-16 items-center gap-3 sm:h-[76px] lg:gap-6">
        <button
          ref={menuButtonRef}
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-tertiary lg:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
        >
          <Menu size={25} strokeWidth={1.8} />
        </button>

        <Link
          href="/"
          className="shrink-0 text-[25px] leading-none text-primary sm:text-[30px]"
          aria-label="SHOP.CO home"
        >
          <span className="font-integral-bold">SHOP.CO</span>
        </Link>

        <nav
          className="hidden shrink-0 items-center gap-5 text-[15px] text-primary lg:flex xl:gap-6"
          aria-label="Main navigation"
        >
          <div className="group relative py-3">
            <Link href="/products" className="flex items-center gap-1">
              Shop
              <ChevronDownIcon
                size={16}
                className="transition-transform duration-200 group-hover:rotate-180"
              />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 min-w-52 translate-y-2 rounded-xl border border-black/10 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {shopCategories.map((category) => (
                <Link
                  key={category}
                  href="/products"
                  className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-tertiary"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/products" className="py-3 transition-opacity hover:opacity-60">
            On Sale
          </Link>
          <Link href="/products" className="py-3 transition-opacity hover:opacity-60">
            New Arrivals
          </Link>
          <Link href="/products" className="py-3 transition-opacity hover:opacity-60">
            Brands
          </Link>
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2 lg:flex-1">
          <label className="hidden h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-tertiary px-4 lg:flex">
            <Search className="shrink-0 text-black/40" size={22} />
            <span className="sr-only">Search for products</span>
            <input
              type="search"
              placeholder="Search for products..."
              className="w-full bg-transparent text-primary outline-none placeholder:text-black/40"
            />
          </label>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-tertiary lg:hidden"
            aria-label="Search"
            onClick={() => setIsMenuOpen(true)}
          >
            <Search size={23} strokeWidth={1.8} />
          </button>
          <Link
            href="/cart"
            className="flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-tertiary"
            aria-label="Shopping cart"
          >
            <ShoppingCartIcon size={23} strokeWidth={1.8} />
          </Link>
          <Link
            href="/"
            className="hidden size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-tertiary sm:flex"
            aria-label="Your account"
          >
            <UserCircle size={24} strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        ref={mobileMenuRef}
        id="mobile-navigation"
        className={`fixed inset-y-0 left-0 z-[60] flex w-[min(88vw,360px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
        aria-modal="true"
        role="dialog"
        inert={!isMenuOpen}
      >
        <div className="flex h-20 items-center justify-between border-b border-black/10 px-5">
          <Link href="/" onClick={closeMenu} aria-label="SHOP.CO home">
            <span className="font-integral-bold text-[28px] leading-none text-primary">
              SHOP.CO
            </span>
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex size-11 items-center justify-center rounded-full bg-tertiary text-primary transition-colors hover:bg-black hover:text-white"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <X size={23} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <label className="mb-7 flex h-12 items-center gap-2 rounded-full bg-tertiary px-4">
            <Search className="shrink-0 text-black/45" size={21} />
            <span className="sr-only">Search for products</span>
            <input
              type="search"
              placeholder="Search for products..."
              className="w-full bg-transparent text-primary outline-none placeholder:text-black/40"
            />
          </label>

          <nav className="space-y-1 text-primary" aria-label="Mobile main navigation">
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-[17px] font-medium transition-colors hover:bg-tertiary"
              onClick={() => setIsShopOpen((current) => !current)}
              aria-expanded={isShopOpen}
            >
              Shop
              <ChevronDownIcon
                size={19}
                className={`transition-transform duration-200 ${
                  isShopOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
                isShopOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <div className="mb-2 ml-3 border-l border-black/15 pl-3">
                  {shopCategories.map((category) => (
                    <Link
                      key={category}
                      href="/products"
                      onClick={closeMenu}
                      className="block rounded-lg px-3 py-2.5 text-[15px] text-black/65 transition-colors hover:bg-tertiary hover:text-primary"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {["On Sale", "New Arrivals", "Brands"].map((item) => (
              <Link
                key={item}
                href="/products"
                onClick={closeMenu}
                className="flex min-h-12 items-center rounded-xl px-3 text-[17px] font-medium transition-colors hover:bg-tertiary"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-black/10 p-5">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-h-12 items-center gap-3 rounded-xl bg-primary px-4 font-medium text-white"
          >
            <UserCircle size={22} />
            My account
          </Link>
        </div>
      </aside>
    </header>
  )
}

export default Header
