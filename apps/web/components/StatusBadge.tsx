import { FiClock, FiCheckCircle, FiXCircle, FiEdit3 } from 'react-icons/fi'

interface StatusBadgeProps {
    status: 'pending' | 'minted' | 'failed' | 'draft'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = {
        pending: {
            className: 'badge-pending',
            icon: FiClock,
            label: 'Pending',
        },
        minted: {
            className: 'badge-success',
            icon: FiCheckCircle,
            label: 'Minted',
        },
        failed: {
            className: 'badge-error',
            icon: FiXCircle,
            label: 'Failed',
        },
        draft: {
            className: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
            icon: FiEdit3,
            label: 'Draft',
        },
    }

    const { className, icon: Icon, label } = config[status]

    return (
        <span className={`badge ${className}`}>
            <Icon className="w-3 h-3" />
            <span>{label}</span>
        </span>
    )
}
