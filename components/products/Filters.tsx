"use client"
import { Sliders, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'



interface FiltersProps {
    variant?: "desktop" | "mobile"
}

export default function Filters({
    variant = "desktop",
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filterError, setFilterError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const closeFilters = () => setIsOpen(false);

    useEffect(() => {
        if (variant !== "mobile" || !isOpen) return;

        const previousOverflow = document.body.style.overflow;
        const trigger = triggerRef.current;

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                return;
            }

            if (event.key !== "Tab") return;

            const focusableElements =
                sheetRef.current?.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
                );

            if (!focusableElements?.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
            trigger?.focus();
        };
    }, [isOpen, variant]);

    const filterPanel = (
        <div className={
            variant === "desktop"
                ? "sticky top-10 hidden rounded-2xl border px-6 py-5 md:block"
                : "flex min-h-0 flex-1 flex-col px-5 pb-5"
        }>
            <div className="flex justify-between pb-6 border-b ">
                <h3
                    id={variant === "mobile" ? "mobile-filter-title" : undefined}
                    className="font-bold text-[20px] text-primary"
                >
                    Filters
                </h3>
                {variant === "mobile" ? (
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={closeFilters}
                        className="-mr-2 flex size-10 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-tertiary hover:text-primary"
                        aria-label="Close filters"
                    >
                        <X size={24} />
                    </button>
                ) : (
                    <Sliders size={24} />
                )}
            </div>
            <div className={
                variant === "desktop"
                    ? "my-2 max-h-[65vh] overflow-y-auto hide-scrollbar"
                    : "my-2 min-h-0 flex-1 overflow-y-auto overscroll-contain hide-scrollbar"
            }>
                <form id={variant + "-product-filters"} key={searchParams.toString()} className="space-y-5 py-5"
                    onSubmit={(event) => {
                        event.preventDefault();
                        const form = event.currentTarget;
                        const data = new FormData(form);
                        const min = String(data.get("minPrice") ?? "");
                        const max = String(data.get("maxPrice") ?? "");
                        if (min && max && Number(max) < Number(min)) {
                            setFilterError("Maximum price must be at least the minimum price.");
                            return;
                        }
                        setFilterError(null);
                        const params = new URLSearchParams(searchParams.toString());
                        for (const name of ["search", "category", "minPrice", "maxPrice", "inStock"]) {
                            const value = String(data.get(name) ?? "").trim();
                            if (value) params.set(name, name === "category" ? value.toLowerCase() : value);
                            else params.delete(name);
                        }
                        params.set("page", "1");
                        router.push(pathname + "?" + params.toString());
                        closeFilters();
                    }}>
                    <label className="block">Search
                        <input name="search" maxLength={100} defaultValue={searchParams.get("search") ?? ""} className="mt-2 w-full rounded-lg border p-2" />
                    </label>
                    <label className="block">Category
                        <input name="category" maxLength={100} placeholder="e.g. clothing" defaultValue={searchParams.get("category") ?? ""} className="mt-2 w-full rounded-lg border p-2" />
                    </label>
                    <fieldset className="space-y-3">
                        <legend className="font-bold">Base price</legend>
                        <label className="block">Minimum price
                            <input name="minPrice" type="number" min="0" step="0.01" defaultValue={searchParams.get("minPrice") ?? ""} className="mt-2 w-full rounded-lg border p-2" />
                        </label>
                        <label className="block">Maximum price
                            <input name="maxPrice" type="number" min="0" step="0.01" defaultValue={searchParams.get("maxPrice") ?? ""} className="mt-2 w-full rounded-lg border p-2" />
                        </label>
                    </fieldset>
                    <label className="block">Availability
                        <select name="inStock" defaultValue={searchParams.get("inStock") ?? ""} className="mt-2 w-full rounded-lg border p-2">
                            <option value="">All products</option>
                            <option value="true">In stock</option>
                            <option value="false">Out of stock</option>
                        </select>
                    </label>
                    {filterError && <p role="alert" className="text-red-600">{filterError}</p>}
                    <button type="button" className="underline" onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        for (const name of ["search", "category", "minPrice", "maxPrice", "inStock", "page"]) params.delete(name);
                        setFilterError(null);
                        router.push(pathname + "?" + params.toString());
                        closeFilters();
                    }}>Clear filters</button>
                </form>
            </div>

            <button type="submit" form={variant + "-product-filters"} className="w-full rounded-full bg-black py-4 text-white">Apply filters</button>

        </div>
    );

    if (variant === "desktop") return filterPanel;

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tertiary text-primary transition-colors hover:bg-black hover:text-white md:hidden"
                aria-label="Open filters"
                aria-controls="mobile-filter-sheet"
                aria-expanded={isOpen}
            >
                <SlidersHorizontal size={19} />
            </button>

            <div
                className={`fixed inset-0 z-[70] bg-black/45 transition-opacity duration-300 md:hidden ${
                    isOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
                onClick={closeFilters}
                aria-hidden="true"
            />

            <div
                ref={sheetRef}
                id="mobile-filter-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-filter-title"
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={`fixed inset-x-0 bottom-0 z-[80] mx-auto flex h-[88dvh] max-h-[760px] w-full max-w-xl flex-col overflow-hidden rounded-t-[24px] bg-white pt-3 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
                    isOpen ? "translate-y-0" : "translate-y-full"
                }`}
            >
                <div
                    className="mx-auto mb-3 h-1 w-12 rounded-full bg-black/15"
                    aria-hidden="true"
                />
                {filterPanel}
            </div>
        </>
    );
}
