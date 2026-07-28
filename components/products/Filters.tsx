"use client"
import { Check, ChevronRight, Sliders, SlidersHorizontal, X } from 'lucide-react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useRef, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import Button from '../Button'


interface FiltersProps {
    variant?: "desktop" | "mobile"
}

export default function Filters({
    variant = "desktop",
}: FiltersProps) {
    const [price, setPrice] = useState([50, 200]);
    const [selectedColor, setSelectedColor] = useState("blue");
    const [selectedSize, setSelectedSize] = useState("large");
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
                    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
                <Accordion
                    className="w-full pb-6 pt-2 border-b"

                >
                    {categoryData.map((category) => (
                        <AccordionItem

                            key={category.id}
                            value={category.id}
                            className="border-none"
                        >
                            <AccordionTrigger
                                className="
                                group
                                py-3
                                text-base
                                font-normal
                                text-muted-foreground
                                hover:no-underline
                                *:data-[slot=accordion-trigger-icon]:hidden
                            "
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span>{category.name}</span>

                                    {category.children?.length && <ChevronRight className="h-5 w-5 transition-transform duration-200  group-aria-expanded:rotate-90" />}
                                </div>
                            </AccordionTrigger>

                            {category.children?.length ? (
                                <AccordionContent className="pb-2">
                                    <div className="ml-2 flex flex-col border-l pl-4">
                                        {category.children.map((child) => (
                                            <button
                                                key={child.id}
                                                type="button"
                                                className="py-2 text-left text-sm text-muted-foreground hover:text-primary"
                                                onClick={() => {
                                                    console.log({
                                                        category: category.id,
                                                        subcategory: child.id,
                                                    });
                                                }}
                                            >
                                                {child.name}
                                            </button>
                                        ))}
                                    </div>
                                </AccordionContent>
                            ) : null}
                        </AccordionItem>
                    ))}
                    {/* {categoryData.map((category) => (
                    <AccordionItem
                        key={category.id}
                        value={category.id}
                    >
                        <AccordionTrigger className="py-4 text-base font-normal text-muted-foreground hover:no-underline">
                            {category.name}
                        </AccordionTrigger>

                        {category.children?.length ? (
                            <AccordionContent>
                                <div className="flex flex-col gap-1 border-l pl-4">
                                    {category.children.map((child) => (
                                        <button
                                            key={child.id}
                                            type="button"
                                            className="w-full rounded-md px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                            onClick={() => {
                                                console.log({
                                                    category: category.id,
                                                    subcategory: child.id,
                                                });
                                            }}
                                        >
                                            {child.name}
                                        </button>
                                    ))}
                                </div>
                            </AccordionContent>
                        ) : null}
                    </AccordionItem>
                ))} */}
                </Accordion>

                <div className='py-6 border-b'>
                    <h3 className="font-bold text-[20px] text-primary">Price</h3>
                    <div>
                        <Slider
                            value={price}
                            onValueChange={(value) => setPrice(value as number[])}
                            min={0}
                            max={250}
                            step={5}
                            className="w-full mt-5"
                        />
                        <div className="mt-2 flex justify-between text-primary">
                            <span>${price[0]}</span>
                            <span>${price[1]}</span>
                        </div>
                    </div>
                </div>

                <Accordion
                    className="border-b py-6"
                >
                    <AccordionItem value="colors" className="border-none">
                        <AccordionTrigger className="py-0 hover:no-underline">
                            <h3 className="text-[20px] font-bold text-primary">
                                Colors
                            </h3>
                        </AccordionTrigger>

                        <AccordionContent className="pt-5">
                            <div className="flex flex-wrap gap-3">
                                {colors.map((color) => (
                                    <label
                                        key={color.id}
                                        htmlFor={`color-${color.id}`}
                                        className="cursor-pointer"
                                    >
                                        <input
                                            id={`color-${color.id}`}
                                            type="radio"
                                            name="product-color"
                                            value={color.id}
                                            checked={selectedColor === color.id}
                                            onChange={(event) =>
                                                setSelectedColor(event.target.value)
                                            }
                                            className="peer sr-only"
                                        />

                                        <span
                                            className={`
                    flex size-10 items-center justify-center rounded-full
                    border border-black/15 transition
                    peer-focus-visible:ring-2
                    peer-focus-visible:ring-primary
                    peer-focus-visible:ring-offset-2
                    ${color.className}
                  `}
                                            aria-hidden="true"
                                        >
                                            {selectedColor === color.id && (
                                                <Check
                                                    className={
                                                        color.id === "white" || color.id === "yellow"
                                                            ? "size-5 text-black"
                                                            : "size-5 text-white"
                                                    }
                                                />
                                            )}
                                        </span>

                                        <span className="sr-only">{color.name}</span>
                                    </label>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion
                    className="pt-6 pb-3"
                >
                    <AccordionItem value="size" className="border-none">
                        <AccordionTrigger className="py-0 hover:no-underline">
                            <h3 className="text-[20px] font-bold text-primary">
                                Size
                            </h3>
                        </AccordionTrigger>

                        <AccordionContent className="pt-5">
                            <div className="flex flex-wrap gap-3">
                                {sizes.map((size) => (
                                    <label
                                        key={size.id}
                                        htmlFor={`size-${size.id}`}
                                        className="cursor-pointer"
                                    >
                                        <input
                                            id={`size-${size.id}`}
                                            type="radio"
                                            name="product-size"
                                            value={size.id}
                                            checked={selectedSize === size.id}
                                            onChange={(event) =>
                                                setSelectedSize(event.target.value)
                                            }
                                            className="peer sr-only"
                                        />

                                        <span
                                            className="block
                                            rounded-full bg-muted px-5 py-3
                                            text-sm text-muted-foreground
                                            transition-colors
                                            peer-checked:bg-black
                                            peer-checked:text-white                    
                                        "
                                        >
                                            {size.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* <Accordion
                className="border-b py-6"
            >
                <AccordionItem value="size" className="border-none">
                    <AccordionTrigger className="py-0 hover:no-underline">
                        <h3 className="text-[20px] font-bold text-primary">
                            Size
                        </h3>
                    </AccordionTrigger>

                    <AccordionContent className="pt-5">
                        <div className="flex flex-wrap gap-3">
                            {sizes.map((size) => (
                                <label
                                    key={size.id}
                                    htmlFor={`size-${size.id}`}
                                    className="cursor-pointer"
                                >
                                    <input
                                        id={`size-${size.id}`}
                                        type="radio"
                                        name="product-size"
                                        value={size.id}
                                        checked={selectedSize === size.id}
                                        onChange={(event) =>
                                            setSelectedSize(event.target.value)
                                        }
                                        className="peer sr-only"
                                    />

                                    <span
                                        className="block
                                            rounded-full bg-muted px-5 py-3
                                            text-sm text-muted-foreground
                                            transition-colors
                                            peer-checked:bg-black
                                            peer-checked:text-white                    
                                        "
                                    >
                                        {size.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion> */}
            </div>

            <Button btnProps={{
                text: "Apply Filter",
                className: "py-6 w-full",
                variant: "black",
                onClick: variant === "mobile" ? closeFilters : undefined,
            }} />

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

const sizes = [
    { id: "xx-small", name: "XX-Small" },
    { id: "x-small", name: "X-Small" },
    { id: "small", name: "Small" },
    { id: "medium", name: "Medium" },
    { id: "large", name: "Large" },
    { id: "x-large", name: "X-Large" },
    { id: "xx-large", name: "XX-Large" },
    { id: "3x-large", name: "3X-Large" },
    { id: "4x-large", name: "4X-Large" },
];

const colors = [
    { id: "green", name: "Green", className: "bg-green-500" },
    { id: "red", name: "Red", className: "bg-red-500" },
    { id: "yellow", name: "Yellow", className: "bg-yellow-400" },
    { id: "orange", name: "Orange", className: "bg-orange-500" },
    { id: "cyan", name: "Cyan", className: "bg-cyan-400" },

    { id: "blue", name: "Blue", className: "bg-blue-600" },
    { id: "purple", name: "Purple", className: "bg-purple-600" },
    { id: "pink", name: "Pink", className: "bg-pink-500" },
    { id: "white", name: "White", className: "bg-white" },
    { id: "black", name: "Black", className: "bg-black" },

    { id: "gray", name: "Gray", className: "bg-gray-500" },
    { id: "brown", name: "Brown", className: "bg-amber-800" },
    { id: "beige", name: "Beige", className: "bg-stone-300" },
    { id: "navy", name: "Navy", className: "bg-slate-900" },
    { id: "teal", name: "Teal", className: "bg-teal-500" },

    { id: "lime", name: "Lime", className: "bg-lime-400" },
    { id: "indigo", name: "Indigo", className: "bg-indigo-600" },
    { id: "violet", name: "Violet", className: "bg-violet-500" },
    { id: "rose", name: "Rose", className: "bg-rose-500" },
    { id: "emerald", name: "Emerald", className: "bg-emerald-500" },
];

const categoryData = [{
    id: "t-shirts",
    name: "T-shirts",
    children: [
        { id: "plain-t-shirts", name: "Plain T-shirts", },
        { id: "graphic-t-shirts", name: "Graphic T-shirts", },
        { id: "oversized-t-shirts", name: "Oversized T-shirts", },
        { id: "polo-t-shirts", name: "Polo T-shirts", },
        { id: "full-sleeve-t-shirts", name: "Full Sleeve T-shirts", },],
}, {
    id: "shorts",
    name: "Shorts",
}
    , {
    id: "shirts",
    name: "Shirts",
    children: [{ id: "casual-shirts", name: "Casual Shirts", }, { id: "formal-shirts", name: "Formal Shirts", }, { id: "printed-shirts", name: "Printed Shirts", }, { id: "denim-shirts", name: "Denim Shirts", }, { id: "checked-shirts", name: "Checked Shirts", },],
},
{
    id: "hoodie",
    name: "Hoodie",
    children: [{ id: "pullover-hoodies", name: "Pullover Hoodies", }, { id: "zip-up-hoodies", name: "Zip-up Hoodies", }, { id: "oversized-hoodies", name: "Oversized Hoodies", }, { id: "printed-hoodies", name: "Printed Hoodies", },],
}, {
    id: "jeans",
    name: "Jeans",
    children: [{ id: "skinny-jeans", name: "Skinny Jeans", }, { id: "slim-fit-jeans", name: "Slim Fit Jeans", }, { id: "straight-fit-jeans", name: "Straight Fit Jeans", }, { id: "baggy-jeans", name: "Baggy Jeans", }, { id: "ripped-jeans", name: "Ripped Jeans", },],
},];
