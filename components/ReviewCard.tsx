import React from 'react'
// @ts-ignore
import ReactStars from 'react-stars'

export interface ReviewCardProps {
    rating: number,
    username: string,
    color?: string,
    review: string,
    dateOfReview?: string
}

const ReviewCard = ({
    rating,
    username,
    color,
    review,
    dateOfReview
}: ReviewCardProps) => {
    return (
        <div className='py-7 px-8 rounded-2xl border-border-color border'>
            <ReactStars
                count={5}
                size={24}
                value={rating}
                color2={color ?? '#ffd700'}
                edit={false}

            />
            <div className='flex gap-1 text-[20px] items-center'>
                <h3 className='font-bold text-[20px] text-primary'>{username}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 bg-[#01AB31] text-white rounded-full p-1">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
            </div>
            <div className='h-40 overflow-y-auto mt-3'>{review}</div>
            { dateOfReview && (
                <div className='mt-6 text-[#000000]/60 font-satoshi-medium'>Posted on August 18, 2023</div>
            )}
        </div>
    )
}

export default ReviewCard