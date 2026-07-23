import { useSearchParams } from 'next/navigation';
import React from 'react'

const ProductTabsSection = () => {
    const searchParam = useSearchParams()
    const activeTab = searchParam.get('tab') || 'details';
    return (
        <section>
            <div className="grid grid-cols-3">
                <div>Product Details</div>
                <div>Rating & Reviews</div>
                <div>FAQs</div>
            </div>
        </section>
    )
}

export default ProductTabsSection