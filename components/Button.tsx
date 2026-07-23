import React from 'react'

export interface ButtonData {
    text: string
    icon?: React.ReactNode,
    variant?: 'black' | 'white'
    className?: string
    onClick?: () => void
}

interface ButtonProps {
    btnProps: ButtonData;
}

const Button = ({ btnProps: {
    text,
    icon,
    variant = "white",
    onClick,
    className = ""

} }: ButtonProps) => {
    return (
        <button className={`
            ${variant === "black"
                ? "bg-primary text-secondary"
                : "bg-secondary text-primary border border-border-color"}
            py-4 px-12 rounded-full font-medium
            ${className}
        `}
            onClick={onClick} >
            {text}
            {icon && <span className='ml-2'>{icon}</span>}
        </button >
    )
}

export default Button