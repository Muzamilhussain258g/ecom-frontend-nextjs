import ProductGallery from '@/components/productDetailC/ProductGallery'
import React from 'react'

function ProductDetailSection() {
    return (
        <main>
            <div className='container grid grid-cols-2'>
                <ProductGallery />
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis corrupti nulla dolores odit asperiores eius dolorem. Autem voluptatibus, ad odit iusto saepe aliquam dolor? Ea veritatis suscipit fugiat harum!
                </div>
            </div>
        </main>
    )
}

export default ProductDetailSection