import { useState } from 'react'

const PHONE_NUMBER = '010-6480-1979'
const EMAIL = 'jodesign94@gmail.com'

export default function ContactSection() {
  const [showCopyModal, setShowCopyModal] = useState(false)

  const showCopyAlert = () => {
    setShowCopyModal(true)
    setTimeout(() => setShowCopyModal(false), 1200)
  }

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(EMAIL).then(showCopyAlert)
  }

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isDesktop = window.matchMedia('(hover: hover)').matches
    if (isDesktop) {
      e.preventDefault()
      navigator.clipboard.writeText(PHONE_NUMBER).then(showCopyAlert)
    }
  }

  return (
    <>
      <section id="contact" className="bg-[#2b2b2b] flex flex-col min-h-[60vh] sm:min-h-[65vh] py-16 sm:py-20 md:py-24">
        <div className="container-custom flex-1 flex flex-col items-center justify-center text-center">
          {/* 프로필 컨텐츠 - 섹션 중앙 */}
          <h2 className="font-bold text-[#f4f4f4] text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1 sm:mb-2 md:mb-3">
            Thank You
          </h2>
          <p className="text-[#f4f4f4] text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5 mb-8 sm:mb-10 md:mb-12">
            브랜드에 색을 더하는 웹디자이너, 조성희입니다.
          </p>
          <div className="w-[192px] max-w-full mx-auto mb-8 sm:mb-10 md:mb-12 rounded-full overflow-hidden" style={{ aspectRatio: '192/245' }}>
            <img
              src="/images/profile-img2.jpg"
              alt="조성희 프로필"
              className="w-full h-full object-cover"
              width={192}
              height={245}
              loading="lazy"
            />
          </div>
          <div className="inline-flex items-center justify-center bg-[#29e160] rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 gap-4 sm:gap-6 md:gap-8">
            <button
              type="button"
              onClick={handleEmailClick}
              className="flex items-center gap-2 text-[#2b2b2b] hover:opacity-80 transition-opacity cursor-pointer underline"
            >
              <span className="font-semibold text-sm sm:text-base">E.</span>
              <span className="text-sm sm:text-base">{EMAIL}</span>
            </button>
            <div className="w-px h-5 bg-[#22C653]" />
            <a
              href={`tel:${PHONE_NUMBER}`}
              onClick={handlePhoneClick}
              className="flex items-center gap-2 text-[#2b2b2b] hover:opacity-80 transition-opacity cursor-pointer underline"
            >
              <span className="font-semibold text-sm sm:text-base">P.</span>
              <span className="text-sm sm:text-base">{PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 카피라이트 - 섹션 컨테이너 밖, 별도 영역 */}
      <div className="bg-[#2b2b2b] pt-10 sm:pt-12 md:pt-16 pb-8 sm:pb-10 md:pb-12 text-center">
        <p className="text-[#f4f4f4] text-xs sm:text-sm opacity-60">
          © 2026 Jodesign. All rights reserved.
        </p>
      </div>

      {/* 복사 완료 얼럿 모달 */}
      {showCopyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="alert"
          aria-live="polite"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="relative bg-[#2b2b2b] border border-[#29e160]/40 rounded-2xl shadow-xl px-8 py-6 min-w-[200px] text-center">
            <p className="text-[#f4f4f4] font-semibold text-sm">복사됐습니다</p>
          </div>
        </div>
      )}
    </>
  )
}
