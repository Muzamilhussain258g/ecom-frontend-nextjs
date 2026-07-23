import React from 'react'

const Heading = ({ text, className }: { text: string, className?: string }) => {
    return (
        <h2 className={`capitalize text-center text-[24px] sm:text-[30px] lg:text-[48px] text-primary ${className}`}>{text}</h2>
    )
}

export default Heading