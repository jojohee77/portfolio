type CategoryBadgeProps = {
  label: string
}

// Figma에서 export한 찌그러진 타원 path (96×33)
const CATEGORY_PILL_PATH_D =
  'M48 0.5C61.2146 0.5 73.157 2.34213 81.7783 5.30566C86.0913 6.78826 89.5458 8.54269 91.9121 10.4658C94.2825 12.3923 95.5 14.4341 95.5 16.5C95.5 18.5659 94.2825 20.6077 91.9121 22.5342C89.5458 24.4573 86.0913 26.2117 81.7783 27.6943C73.157 30.6579 61.2146 32.5 48 32.5C34.7854 32.5 22.843 30.6579 14.2217 27.6943C9.90866 26.2117 6.45423 24.4573 4.08789 22.5342C1.71753 20.6077 0.5 18.5659 0.5 16.5C0.5 14.4341 1.71753 12.3923 4.08789 10.4658C6.45423 8.54269 9.90866 6.78826 14.2217 5.30566C22.843 2.34213 34.7854 0.5 48 0.5Z'

export function CategoryBadge({ label }: CategoryBadgeProps) {
  return (
    <div className="relative inline-flex items-center justify-center h-[30px] w-[84px]">
      <svg
        className="absolute inset-0 block"
        viewBox="0 0 96 33"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d={CATEGORY_PILL_PATH_D}
          stroke="#2BD35D"
          fill="black"
          fillOpacity={0.3}
        />
      </svg>
      <span className="relative font-semibold text-[13px] text-[#2BD35D] leading-none whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}

