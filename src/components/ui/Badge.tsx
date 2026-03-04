import { CategoryBadge } from '@/components/ui/CategoryBadge'

type ProjectCategory = 'Product' | 'WEB' | 'APP'

interface BadgeProps {
  label: ProjectCategory
  className?: string
}

export default function Badge({ label, className = '' }: BadgeProps) {
  if (!className) {
    return <CategoryBadge label={label} />
  }

  return (
    <div className={className}>
      <CategoryBadge label={label} />
    </div>
  )
}
