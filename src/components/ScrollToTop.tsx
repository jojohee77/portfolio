import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  // useLayoutEffect: 브라우저가 화면을 그리기 전에 스크롤 처리
  useLayoutEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
    }

    // behavior: 'instant'로 전역 scroll-behavior: smooth를 무시 → 라우트 이동 시 애니메이션 없이 바로 맨 위
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
