interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionTitleProps) {
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <h2 className="font-bold text-[#f4f4f4] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#a0a0a0] text-base sm:text-lg md:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
