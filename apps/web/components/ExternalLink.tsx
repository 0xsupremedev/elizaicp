import { FiExternalLink } from 'react-icons/fi'

interface ExternalLinkProps {
    href: string
    label: string
    className?: string
}

export default function ExternalLink({ href, label, className = '' }: ExternalLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors ${className}`}
        >
            {label}
            <FiExternalLink className="w-3 h-3" />
        </a>
    )
}
