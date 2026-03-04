import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

interface ScrollTopButtonProps {
  /** 스크롤 이 높이(px)를 넘으면 버튼 표시 */
  threshold?: number
}

export default function ScrollTopButton({ threshold = 1000 }: ScrollTopButtonProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-8 right-6 sm:right-10 z-30 w-[50px] h-[50px] rounded-full bg-[#3b3b3b] text-[#29e160] flex items-center justify-center shadow-lg hover:bg-[#29e160] hover:text-[#2b2b2b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#29e160] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b2b2b]"
      aria-label="맨 위로"
    >
      <ChevronUp className="w-6 h-6" strokeWidth={2.5} />
    </button>
  )
}
