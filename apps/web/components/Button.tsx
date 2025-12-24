import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode
    href?: string
    external?: boolean
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit'
}

export default function Button({
    children,
    href,
    external,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    disabled,
    type = 'button',
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-gradient-to-r from-icp-purple to-icp-blue hover:opacity-90 text-white',
        secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
        outline: 'bg-transparent border border-white/30 hover:bg-white/10 text-white',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    if (href) {
        if (external) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes}
                >
                    {children}
                </a>
            )
        }
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        )
    }

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
