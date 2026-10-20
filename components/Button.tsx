import React from 'react'

export interface ButtonData {
    text?: string
    icon?: React.ReactNode,
    variant?: 'black' | 'white'
    className?: string
    onClick?: () => void
    disabled?: boolean
}

interface ButtonProps {
    btnProps: ButtonData;
}

const Button = ({ btnProps: {
    text,
    icon,
    variant = "white",
    onClick,
    disabled,
    className = ""

} }: ButtonProps) => {
    return (
        <button className={`
            ${icon && "flex items-center text-center justify-center"}
            max-sm:w-full
            ${variant === "black"
                ? "bg-primary text-secondary"
                : "bg-secondary text-primary border border-border-color"}
            py-4 px-12 rounded-full font-medium
            ${className}
        `}
            onClick={onClick} disabled={disabled} >
            {text && text}
            {icon && <span className='ml-2'>{icon}</span>}
        </button >
    )
}

export default Button
