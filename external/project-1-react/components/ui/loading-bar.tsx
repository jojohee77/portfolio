"use client"

interface LoadingBarProps {
  message?: string
  barHeight?: number
  barWidth?: string
  fontSize?: 'xs' | 'sm' | 'base'
  className?: string
}

export default function LoadingBar({
  message = "불러오는중입니다",
  barHeight = 8,
  barWidth = "max-w-xs",
  fontSize = "xs",
  className = "",
}: LoadingBarProps) {
  const fontSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <p className={`${fontSizeClasses[fontSize]} text-gray-600 mb-3`}>
        {message}
      </p>
      <div 
        className={`w-full ${barWidth} bg-gray-200 rounded-full overflow-hidden`}
        style={{ height: `${barHeight}px` }}
      >
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-blue-300 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" 
          style={{
            animation: 'loading 1.5s ease-in-out infinite',
            width: '40%',
            transformOrigin: 'left center'
          }}
        />
      </div>
    </div>
  )
}

