import React from 'react'
// @ts-ignore
import ReactStars from 'react-stars'

export interface ProductRating {
    rating: number; // optional, default 0
    size?: number; // optional, default 24
    edit?: boolean
}



const RatingStars = ({ rating = 0, size = 24, edit = false }: ProductRating) => {
    return (
        <div className=' flex items-center gap-2'>
            <ReactStars
                count={5}
                size={size}
                value={rating ?? 0}
                color2="#ffd700"
                edit={edit} // read-only

            />
            <span className='max-sm:text-sm'>
                <span className='text-primary'>{rating ?? 0} </span>
                /5
            </span>
        </div>
    )
}

export default RatingStars