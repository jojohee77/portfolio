import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactSection from '@/components/shared/ContactSection'
import SectionTitle from '@/components/ui/SectionTitle'
import ProjectCard from '@/components/ui/ProjectCard'
import SkillIcon from '@/components/ui/SkillIcon'

const navItems = [
  { label: 'Intro', href: '#intro' },
  { label: 'Profile', href: '#profile' },
  { label: 'Projects', href: '#projects' },
  { label: 'Additional', href: '#additional' },
  { label: 'Contact', href: '#contact' },
]

// ——— 고정 데이터 ———
const profileInfo = { name: '조성희', birth: '1994.10.01', phone: '010-6480-1979', email: 'jodesign94@gmail.com' }

const experiences = [
  { id: 'winnobos', period: '2024.07 - 2026.02', company: '(주)위노보스', role: 'Product Designer & Frontend Developer' },
  { id: 'dreamtech', period: '2018.10 - 2024.02', company: '드림네트웍스', role: 'Web Designer & Frontend Developer' },
  { id: 'livingduo', period: '2017.06 - 2018.01', company: '리빙듀오', role: 'Web Designer' },
]

const educations = [
  { id: 'edu-2018', year: '2018', title: '스마트웹디자인&모바일UI/UX실무자양성과정 수료' },
  { id: 'edu-2017', year: '2017', title: '[NCS]스마트모바일앱&웹디자인실무과정 수료' },
  { id: 'edu-college', year: '2015', title: '유한대학교 산업디자인과 졸업' },
  { id: 'edu-highschool', year: '2013', title: '작전 여자 고등학교 졸업' },
]

const skills = [
  { id: 'html', name: 'HTML', icon: '/images/skill-1.png', category: 'coding' as const },
  { id: 'css', name: 'CSS', icon: '/images/skill-2.png', category: 'coding' as const },
  { id: 'js', name: 'JavaScript', icon: '/images/skill-3.png', category: 'coding' as const },
  { id: 'jquery', name: 'jQuery', icon: '/images/jquery.png', category: 'coding' as const },
  { id: 'photoshop', name: 'Photoshop', icon: '/images/skill-4.png', category: 'design' as const },
  { id: 'illustrator', name: 'Illustrator', icon: '/images/skill-5.png', category: 'design' as const },
  { id: 'figma', name: 'Figma', icon: '/images/skill-6.png', category: 'design' as const },
  { id: 'xd', name: 'Adobe XD', icon: '/images/skill-7.png', category: 'design' as const },
  { id: 'zeplin', name: 'Zeplin', icon: '/images/skill-8.png', category: 'design' as const },
  { id: 'cursor', name: 'Cursor AI', icon: '/images/ai-cursor.png', category: 'ai' as const },
  { id: 'figma-make', name: 'Figma Make', icon: '/images/ai-figma.png', category: 'ai' as const },
  { id: 'v0', name: 'V0.app', icon: '/images/ai-v0app.png', category: 'ai' as const },
  { id: 'chatgpt', name: 'ChatGPT', icon: '/images/ai-chatGPT.png', category: 'ai' as const },
  { id: 'gemini', name: 'Gemini', icon: '/images/ai-gemini.png', category: 'ai' as const },
  { id: 'claude', name: 'Claude', icon: '/images/ai-claude.png', category: 'ai' as const },
  { id: 'perplexity', name: 'Perplexity', icon: '/images/ai-perplexity.png', category: 'ai' as const },
]

const projects = [
  { id: 'ag-office', title: 'Ag오피스', description: '마케팅 대행사 전용 AI플랫폼', category: 'Product' as const, thumbnail: '/images/projects/project-thum1.jpg', link: '/project/ag-office', year: '2025' },
  { id: 'bbagle-ai', title: '빠글AI', description: 'AI 블로그 자동 포스팅 서비스', category: 'Product' as const, thumbnail: '/images/projects/project-thum2.jpg', link: '/project/bbagle-ai', year: '2025' },
  { id: 'gazet-ai', title: '가제트AI', description: 'AI 블로그 글쓰기', category: 'Product' as const, thumbnail: '/images/projects/project-thum3.jpg', link: '/project/gazet-ai', year: '2025' },
  { id: 'hamster-mbti', title: '햄찌MBTI', description: '햄찌 MBTI테스트 사이트', category: 'WEB' as const, thumbnail: '/images/projects/project-thum4.jpg', link: '/project/hamster-mbti', year: '2024' },
  { id: 'hidden-ad', title: '히든애드', description: '마케팅 소개 웹 사이트', category: 'WEB' as const, thumbnail: '/images/projects/project-thum5.jpg', link: '/project/hidden-ad', year: '2024' },
  { id: 'abridge', title: '에이브릿지', description: '배드민턴 레슨장 소개 웹 사이트', category: 'WEB' as const, thumbnail: '/images/projects/project-thum6.jpg', link: '/project/abridge', year: '2023' },
  { id: 'gongja', title: '공짜시대', description: '광고포인트로 게임과 쇼핑을하는 리워드앱', category: 'APP' as const, thumbnail: '/images/projects/project-app-thum1.jpg', link: '/project/gongja', year: '2023' },
  { id: 'yaguin', title: '야구인닷컴', description: '전국 야구레슨장 찾기 플랫폼', category: 'APP' as const, thumbnail: '/images/projects/project-app-thum2.jpg', link: '/project/yaguin', year: '2023' },
  { id: 'treasure', title: '트레저', description: '해저 스포츠를 한곳에 모아둔 플랫폼', category: 'APP' as const, thumbnail: '/images/projects/project-app-thum3.jpg', link: '/project/treasure', year: '2022' },
]

type ProductDetailProject = {
  id: number
  thumb: string
  image: string
  alt: string
}

const productDetailProjects: ProductDetailProject[] = [
  {
    id: 1,
    thumb: '/images/detailpage/detail-img1-thum.jpg',
    image: '/images/detailpage/detail-img1.jpg',
    alt: '제품 상세 페이지 디자인 1',
  },
  {
    id: 2,
    thumb: '/images/detailpage/detail-img2-thum.jpg',
    image: '/images/detailpage/detail-img2.jpg',
    alt: '제품 상세 페이지 디자인 2',
  },
  {
    id: 3,
    thumb: '/images/detailpage/detail-img3-thum.jpg',
    image: '/images/detailpage/detail-img3.jpg',
    alt: '제품 상세 페이지 디자인 3',
  },
  {
    id: 4,
    thumb: '/images/detailpage/detail-img4-thum.jpg',
    image: '/images/detailpage/detail-img4.jpg',
    alt: '제품 상세 페이지 디자인 4',
  },
]

const additionalWorks: { id: number; image: string; alt: string; detailImage?: string }[] = [
  { id: 1, image: '/images/projects/additional1-thum.jpg', alt: '반포옥 로고 디자인', detailImage: '/images/projects/additional1-detail.jpg' },
  { id: 2, image: '/images/projects/additional2-thum.jpg', alt: '인천국제공항리그 로고 디자인', detailImage: '/images/projects/additional2-detail.jpg' },
  { id: 3, image: '/images/projects/additional3-thum.jpg', alt: '로고 디자인 2', detailImage: '/images/projects/additional3-detail.jpg' },
  { id: 4, image: '/images/projects/additional4-thum.jpg', alt: '명함 디자인 2', detailImage: '/images/projects/additional4-detail.jpg' },
  { id: 5, image: '/images/projects/additional5-thum.jpg', alt: '로고 디자인 3', detailImage: '/images/projects/additional5-detail.jpg' },
  { id: 6, image: '/images/projects/additional6-thum.jpg', alt: '명함 디자인 3', detailImage: '/images/projects/additional6-detail.jpg' },
  { id: 7, image: '/images/projects/additional7-thum.jpg', alt: '로고 디자인 4', detailImage: '/images/projects/additional7-detail.jpg' },
  { id: 8, image: '/images/projects/additional8-thum.jpg', alt: '명함 디자인 4', detailImage: '/images/projects/additional8-detail.jpg' },
  { id: 9, image: '/images/projects/additional9-thum.jpg', alt: '로고 디자인 5', detailImage: '/images/projects/additional9-detail.jpg' },
  { id: 10, image: '/images/projects/additional10-thum.jpg', alt: '명함 디자인 5', detailImage: '/images/projects/additional10-detail.jpg' },
  { id: 11, image: '/images/projects/additional11-thum.jpg', alt: '로고 디자인 6', detailImage: '/images/projects/additional11-detail.jpg' },
  { id: 12, image: '/images/projects/additional12-thum.jpg', alt: '명함 디자인 6', detailImage: '/images/projects/additional12-detail.jpg' },
]

const portfolioLetters = [
  { src: '/images/intro-txt-1-1.png', alt: 'P', left: 414.29, top: 146, width: 239, height: 274, rotate: 0 },
  { src: '/images/intro-txt-1-2.png', alt: 'O', left: 629.29, top: 201.94, width: 179, height: 203, rotate: -11.38 },
  { src: '/images/intro-txt-1-3.png', alt: 'R', left: 801.74, top: 154.95, width: 188, height: 240, rotate: -4.85 },
  { src: '/images/intro-txt-2-1.png', alt: 'T', left: 445.15, top: 414.89, width: 176, height: 199, rotate: -6.89 },
  { src: '/images/intro-txt-2-2.png', alt: 'F', left: 626.56, top: 418.37, width: 146, height: 192, rotate: 8.59 },
  { src: '/images/intro-txt-2-3.png', alt: 'O', left: 797.91, top: 432.44, width: 190, height: 208, rotate: 0 },
  { src: '/images/intro-txt-3-1.png', alt: 'L', left: 410.45, top: 626.8, width: 225, height: 252, rotate: 0 },
  { src: '/images/intro-txt-3-2.png', alt: 'I', left: 667.48, top: 611.46, width: 82, height: 237, rotate: 0 },
  { src: '/images/intro-txt-3-3.png', alt: 'O', left: 759.55, top: 622.2, width: 230, height: 260, rotate: 19.97 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}
const letterVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.5, rotateX: -90 },
  visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } },
}
const getFloatingAnimation = (index: number) => ({
  y: [0, -15, 0],
  rotate: [0, 3, 0, -3, 0],
  transition: {
    y: { duration: 3 + (index % 3), repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 },
    rotate: { duration: 4 + (index % 2), repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 },
  },
})

const PRODUCT_DETAIL_NOTICE_VIRTUAL_BRAND = `※ 본 프로젝트는 가상의 브랜드를 설정하여 기획·디자인한 개인 창작 작업입니다.
브랜드명, 제품 및 패키지 이미지는 AI 기반 이미지 생성 도구를 활용하여 제작되었습니다.`

const PRODUCT_DETAIL_NOTICE_DEFAULT = `※ 본 작업물은 실제 브랜드와 무관한 개인 포트폴리오용 프로젝트입니다.
제품 및 모델 이미지는 AI 기반 이미지 생성 도구를 활용하여 제작하였으며, 촬영 없이 컨셉 기획 및 비주얼 연출 역량을 보여주기 위한 작업입니다.`

export default function MainPage() {
  const codingSkills = skills.filter((s) => s.category === 'coding')
  const designSkills = skills.filter((s) => s.category === 'design')
  const aiSkills = skills.filter((s) => s.category === 'ai')

  const [activeSection, setActiveSection] = useState('intro')
  const [menuOpen, setMenuOpen] = useState(false)
  const [additionalModalImage, setAdditionalModalImage] = useState<string | null>(null)
  const [detailModalImage, setDetailModalImage] = useState<string | null>(null)
  const [detailNoticeText, setDetailNoticeText] = useState<string | null>(null)

  useEffect(() => {
    if (additionalModalImage || detailModalImage) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [additionalModalImage, detailModalImage])

  useEffect(() => {
    const sectionIds = ['intro', 'profile', 'projects', 'additional', 'contact']
    const check = () => {
      const y = window.scrollY + window.innerHeight * 0.35
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (!el) continue
        const top = el.offsetTop
        const bottom = top + el.offsetHeight
        if (y >= top && y <= bottom) {
          setActiveSection(sectionIds[i])
          return
        }
      }
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    closeMenu()
  }

  return (
    <main className="bg-[#2b2b2b] overflow-x-hidden">
      {/* 모바일 햄버거 버튼 */}
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="lg:hidden fixed top-5 right-5 z-30 w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-[#2b2b2b]/90 border border-[#474747] text-[#f3f3f3] hover:bg-[#3b3b3b] transition-colors"
        aria-label="메뉴 열기"
        aria-expanded={menuOpen}
      >
        <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-current rounded-full transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* 모바일 메뉴 패널 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="lg:hidden fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={closeMenu} aria-hidden="true" />
            <motion.nav
              className="absolute top-0 right-0 bottom-0 w-64 max-w-[85vw] bg-[#2b2b2b] border-l border-[#474747] shadow-xl flex flex-col pt-20 px-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const id = item.href.slice(1)
                  const isActive = activeSection === id
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className={`py-3 text-lg tracking-tight transition-colors ${isActive ? 'font-semibold text-[#29e160]' : 'text-[#f3f3f3] hover:text-[#29e160]'}`}
                    >
                      {item.label}
                    </a>
                  )
                })}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ——— Hero (메뉴: Intro) ——— */}
      <section id="intro" className="relative min-h-screen bg-[#2b2b2b] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img
            src="/images/intro-deco-bg2.png"
            alt=""
            className="absolute left-[-8%] bottom-[8%] w-48 sm:w-64 md:w-80 lg:w-96 opacity-50"
            initial={{ x: -200, opacity: 0, rotate: -90 }}
            animate={{ x: 0, opacity: 0.5, rotate: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          />
          <motion.img
            src="/images/intro-deco-bg1.png"
            alt=""
            className="absolute right-[-8%] bottom-[-8%] w-64 sm:w-80 md:w-96 lg:w-[450px] opacity-30"
            initial={{ x: 200, opacity: 0, rotate: 45 }}
            animate={{ x: 0, opacity: 0.3, rotate: 45 }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          />
        </div>

        <motion.div
          className="hidden lg:block absolute top-0 left-0 right-0 h-9 bg-[#3b3b3a] z-20"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center h-full px-4">
            <div className="flex gap-2 mr-6">
              <motion.div className="w-3 h-3 rounded-full bg-[#FF5F57]" whileHover={{ scale: 1.2 }} />
              <motion.div className="w-3 h-3 rounded-full bg-[#FDBC30]" whileHover={{ scale: 1.2 }} />
              <motion.div className="w-3 h-3 rounded-full bg-[#29C940]" whileHover={{ scale: 1.2 }} />
            </div>
            <div className="bg-[#2b2b2b] px-4 py-1.5 rounded-t-lg">
              <span className="text-[#bdbdbd] text-xs">성희의 포트폴리오</span>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 w-full min-h-screen pt-12 lg:pt-0">
          <motion.div
            className="hidden lg:block absolute left-[61px] top-[133px] z-20"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="font-semibold leading-normal text-[#f2f2f2] text-2xl tracking-[-0.72px] whitespace-nowrap mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.p className="mb-0" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>WEB</motion.p>
              <motion.p initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>DESIGNER</motion.p>
            </motion.div>
            <motion.p
              className="font-normal leading-normal text-[#f2f2f2] text-lg tracking-[-0.54px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              Jo Seong Hui
            </motion.p>
          </motion.div>

          <motion.div
            className="hidden sm:block lg:hidden absolute top-24 left-1/2 -translate-x-1/2 text-center z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-bold text-[#f2f2f2] mb-2 text-xl sm:text-2xl">
              <div>WEB</div>
              <div>DESIGNER</div>
            </h1>
            <p className="text-[#f2f2f2] text-base sm:text-lg">Jo Seong Hui</p>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1440px] h-[1024px] origin-center scale-[0.55] sm:scale-[0.68] md:scale-[0.8] lg:scale-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {portfolioLetters.map((letter, index) => (
              <motion.div
                key={`${letter.alt}-${index}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${letter.left}px`,
                  top: `${letter.top}px`,
                  width: `${letter.width + 40}px`,
                  height: `${letter.height + 40}px`,
                }}
                variants={letterVariants}
                animate={getFloatingAnimation(index)}
              >
                {letter.rotate !== 0 ? (
                  <div className="flex-none" style={{ transform: `rotate(${letter.rotate}deg)` }}>
                    <img src={letter.src} alt={letter.alt} className="pointer-events-none" style={{ width: `${letter.width}px`, height: `${letter.height}px` }} />
                  </div>
                ) : (
                  <img src={letter.src} alt={letter.alt} className="pointer-events-none" style={{ width: `${letter.width}px`, height: `${letter.height}px` }} />
                )}
              </motion.div>
            ))}
            <motion.div
              className="absolute"
              style={{ left: '978.21px', top: '419.65px', width: '90.79px', height: '95.905px' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
            >
              <img src="/images/intro-deco-small.png" alt="" className="w-full h-full object-contain pointer-events-none" />
            </motion.div>
            <motion.div
              className="absolute"
              style={{ left: '370.81px', top: '571.82px', width: '79.281px', height: '79.281px' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
            >
              <img src="/images/intro-deco-bg2.png" alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" />
            </motion.div>
          </motion.div>

          <motion.nav
            className="hidden lg:block fixed right-[61px] top-[261px] z-20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="font-normal leading-[56px] text-right text-lg tracking-[-0.54px] whitespace-nowrap">
              {navItems.map((item) => {
                const id = item.href.slice(1)
                const isActive = activeSection === id
                return (
                  <motion.p
                    key={item.href}
                    className={isActive ? 'font-semibold mb-0 text-[#29e160]' : 'mb-0 text-[#f3f3f3]'}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + navItems.indexOf(item) * 0.1 }}
                    whileHover={{ scale: 1.05, x: -5 }}
                  >
                    <a href={item.href} onClick={(e) => scrollToSection(e, item.href)} className="hover:text-[#29e160] transition-colors [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">{item.label}</a>
                  </motion.p>
                )
              })}
            </div>
          </motion.nav>

          <motion.div
            className="hidden lg:block absolute right-[61px] top-[160px] z-20 w-[76px] h-[76px]"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="relative w-full h-full">
              <svg className="block w-full h-full" viewBox="0 0 76 76" fill="none" preserveAspectRatio="none">
                <path d="M 60.5 38 A 37.25 20.75 0 1 0 15.5 38 A 37.25 20.75 0 1 1 60.5 38 Z" fill="#29E160" />
                <ellipse cx="38" cy="54.5" rx="37.25" ry="20.75" stroke="#F3F3F3" strokeWidth="1.5" fill="none" />
                <ellipse cx="38" cy="21.5" rx="37.25" ry="20.75" stroke="#F3F3F3" strokeWidth="1.5" fill="none" />
              </svg>
              <motion.p className="absolute left-1/2 -translate-x-1/2 top-[10px] font-normal text-[#f3f3f3] text-base text-center tracking-[-0.8px] pointer-events-none" whileHover={{ scale: 1.05 }}>2026</motion.p>
              <motion.p className="absolute left-1/2 -translate-x-1/2 top-[46px] font-normal text-[#f3f3f3] text-base text-center tracking-[-0.8px] pointer-events-none" whileHover={{ scale: 1.05 }}>Web</motion.p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { duration: 0.6, delay: 1.5 }, y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}}
        >
          <div className="w-6 h-10 border-2 border-[#f3f3f3] rounded-full flex justify-center p-2">
            <motion.div className="w-1 h-3 bg-[#29e160] rounded-full" animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
        </motion.div>
      </section>

      {/* ——— Profile (메뉴: Profile) ——— */}
      <section id="profile" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#2b2b2b]">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 lg:gap-12 items-start justify-center sm:justify-center w-full">
              <div className="shrink-0 w-[384px] max-w-full mx-auto sm:mx-0" style={{ aspectRatio: '384 / 492' }}>
                <div className="w-full h-full rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[3.5rem] overflow-hidden">
                  <img src="/images/profile-img2-navy.jpg" alt="조성희 프로필" className="w-full h-full object-cover" width={384} height={492} loading="lazy" />
                </div>
              </div>
              <div className="shrink-0 w-fit max-w-full text-left mt-3 sm:mt-4 md:mt-6">
                <h2 className="font-bold text-[#f4f4f4] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8">
                  브랜드에 색을 더하는
                  <br />
                  <span className="text-[#29e160]">웹디자이너 조성희</span>
                  <span className="text-[#f4f4f4]"> 입니다.</span>
                </h2>
                <div className="space-y-5 text-[#e9e9e9] text-sm sm:text-base md:text-lg leading-relaxed">
                  <p className="whitespace-pre-line mb-6 sm:mb-8">
                    {`브랜드의 색은 사용자가 찾아줄 때 비로소 완성된다고 생각합니다.
시각적인 재미를 넘어, 사용자가 머무르고 싶은 화면을 설계하는
색깔 있는 웹디자이너 조성희입니다.`}
                  </p>
                  <p className="whitespace-pre-line">
                    {`디자인을 기반으로 UI 설계부터 하드코딩 퍼블리싱, React 기반 프론트엔드
화면 구현까지 전 과정을 직접 수행합니다. Figma, Photoshop, Illustrator
를 활용한 시각 설계와 Cursor AI, Figma AI를 활용한
빠른 프로토타이핑으로 MVP를 빠르게 구축하고,
실제 사용자 반응과 시장 흐름을 초기 단계에서 검증하며 완성도를 높입니다.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— PROFILE · EXPERIENCE · EDUCATION ——— */}
      <section id="about" className="pt-16 sm:pt-20 md:pt-24 pb-0 bg-[#2b2b2b]">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-start">
              <h3 className="text-[#29e160] text-base sm:text-lg md:text-xl font-bold shrink-0 sm:w-64 md:w-72 whitespace-nowrap">PROFILE</h3>
              <div className="flex-1 min-w-0 space-y-4 sm:space-y-5 text-[#e9e9e9] text-sm sm:text-base md:text-lg leading-relaxed">
                <p>{profileInfo.name} ({profileInfo.birth})</p>
                <p>T. {profileInfo.phone}</p>
                <p>E. {profileInfo.email}</p>
              </div>
            </div>

            <div className="h-px bg-[#474747] my-6 sm:my-8" />
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-start">
              <h3 className="text-[#29e160] text-base sm:text-lg md:text-xl font-bold shrink-0 sm:w-64 md:w-72 whitespace-nowrap uppercase">EXPERIENCE OVERVIEW</h3>
              <div className="flex-1 min-w-0 space-y-4 sm:space-y-5 text-[#e9e9e9] text-sm sm:text-base md:text-lg leading-relaxed">
                {experiences.map((exp) => (
                  <p key={exp.id}>
                    <span className="text-[#A0A0A0] inline-block min-w-[5.5rem] sm:min-w-[8.5rem] md:min-w-[10rem]">{exp.period}</span> {exp.company}
                  </p>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#474747] my-6 sm:my-8" />
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-start">
              <h3 className="text-[#29e160] text-base sm:text-lg md:text-xl font-bold shrink-0 sm:w-64 md:w-72 whitespace-nowrap">EDUCATION</h3>
              <div className="flex-1 min-w-0 space-y-4 sm:space-y-5 text-[#e9e9e9] text-sm sm:text-base md:text-lg leading-relaxed">
                {educations.map((edu) => (
                  <p key={edu.id}>
                    <span className="text-[#A0A0A0] inline-block min-w-[3.5rem]">{edu.year}</span> {edu.title}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— SKILL · AI WORKFLOW ——— */}
      <section id="skills" className="pt-6 sm:pt-8 md:pt-8 pb-16 sm:pb-20 md:pb-24 bg-[#2b2b2b]">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="h-px bg-[#474747] mb-6 sm:mb-8" />

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-start">
              <h3 className="text-[#29e160] text-base sm:text-lg md:text-xl font-bold shrink-0 sm:w-64 md:w-72 whitespace-nowrap">SKILL</h3>
              <div className="flex-1 min-w-0 -mx-1">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-1 gap-y-4 sm:gap-x-2 sm:gap-y-5 md:gap-x-3 md:gap-y-6 justify-items-start">
                  {[...codingSkills.slice(0, 3), ...designSkills].map((skill) => (
                    <SkillIcon key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-[#474747] my-6 sm:my-8" />
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 sm:items-start">
              <h3 className="text-[#29e160] text-base sm:text-lg md:text-xl font-bold shrink-0 sm:w-64 md:w-72 whitespace-nowrap uppercase">AI WORKFLOW</h3>
              <div className="flex-1 min-w-0 -mx-1">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-1 gap-y-4 sm:gap-x-2 sm:gap-y-5 md:gap-x-3 md:gap-y-6 justify-items-start">
                  {aiSkills.map((skill) => (
                    <SkillIcon key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— PROJECTS ——— */}
      <section id="projects" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#2b2b2b]">
        <div className="container-custom">
          <SectionTitle title="PROJECTS" subtitle="Product · Web · App UI/UX" className="mb-8 sm:mb-12 md:mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* ——— ADDITIONAL WORKS ——— */}
      <section id="additional" className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-[#2b2b2b]">
        <div className="container-custom">
          <SectionTitle
            title="ADDITIONAL WORKS"
            align="center"
            className="mb-8 sm:mb-12 md:mb-16"
          />

          {/* 상단: Product Detail Page Design */}
          <div className="mb-10">
            <p className="text-[#a0a0a0] text-xs sm:text-sm md:text-base text-center mb-8 sm:mb-10 tracking-[0.22em] uppercase">
              Product Detail Page Design
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {productDetailProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setDetailModalImage(project.image)
                    if (project.id === 1 || project.id === 2 || project.id === 3) {
                      setDetailNoticeText(PRODUCT_DETAIL_NOTICE_VIRTUAL_BRAND)
                    } else {
                      setDetailNoticeText(PRODUCT_DETAIL_NOTICE_DEFAULT)
                    }
                  }}
                  className="group relative w-full aspect-[3/5] overflow-hidden rounded-xl sm:rounded-2xl bg-[#1e1e1e] shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.35)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-inset"
                >
                  <img
                    src={project.thumb}
                    alt={project.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#474747] my-20 sm:my-24 md:my-28" />

          {/* 하단: Logos / Business Cards */}
          <p className="text-[#a0a0a0] text-xs sm:text-sm md:text-base text-center mb-8 sm:mb-10 tracking-[0.22em] uppercase">
            Logos · Business Cards
          </p>
          {(() => {
            const colCount = 6
            type Work = (typeof additionalWorks)[number]
            const columns: Work[][] = Array.from({ length: colCount }, () => [])
            additionalWorks.forEach((work, i) => columns[i % colCount].push(work))
            const pushDownCols = [2, 4, 6]
            const card = (work: Work) => (
              <div
                key={work.id}
                className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#1e1e1e] shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.35)] transition-shadow hover:-translate-y-0.5 w-full h-[180px] sm:h-[240px]"
              >
                {work.detailImage ? (
                  <button
                    type="button"
                    onClick={() => setAdditionalModalImage(work.detailImage!)}
                    className="w-full h-full block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-inset"
                  >
                    <img
                      src={work.image}
                      alt={work.alt}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      loading="lazy"
                    />
                  </button>
                ) : (
                  <img
                    src={work.image}
                    alt={work.alt}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                )}
              </div>
            )
            return (
              <>
                {/* 모바일: 규칙적인 2열 그리드 */}
                <div className="grid grid-cols-2 gap-4 sm:hidden">
                  {additionalWorks.map((work) => card(work))}
                </div>

                {/* 태블릿(~1024px 이하): 규칙적인 4열 × 3행 그리드 */}
                <div className="hidden sm:grid lg:hidden grid-cols-2 sm:grid-cols-4 gap-5 md:gap-6">
                  {additionalWorks.map((work) => card(work))}
                </div>

                {/* 데스크톱(1024px 이상): 불규칙 배열 레이아웃 */}
                <div className="hidden lg:grid lg:grid-cols-6 gap-5 md:gap-6">
                  {columns.map((items, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex flex-col gap-5 md:gap-6 min-w-0"
                      style={{ paddingTop: pushDownCols.includes(colIndex + 1) ? '9rem' : 0 }}
                    >
                      {items.map((work) => card(work))}
                    </div>
                  ))}
                </div>
              </>
            )
          })()}

          {/* Product Detail 확대 모달 */}
          <AnimatePresence>
            {detailModalImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-hidden"
                onClick={() => setDetailModalImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="relative w-full max-w-[860px] max-h-[90vh] overflow-y-auto overflow-x-hidden bg-[#1b1b1b] rounded-xl sm:rounded-2xl p-4 sm:p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-[11px] sm:text-xs leading-relaxed text-[#d4d4d4] mb-4 whitespace-pre-line">
                    {detailNoticeText ?? PRODUCT_DETAIL_NOTICE_DEFAULT}
                  </p>
                  <img
                    src={detailModalImage}
                    alt="제품 상세 페이지 확대 보기"
                    className="w-full max-w-[860px] h-auto max-h-none object-contain rounded-lg block shrink-0"
                  />
                </motion.div>
                <button
                  type="button"
                  onClick={() => setDetailModalImage(null)}
                  className="fixed top-4 right-4 z-[60] text-white/90 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center"
                  aria-label="닫기"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Additional 확대 모달 */}
          <AnimatePresence>
            {additionalModalImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-hidden"
                onClick={() => setAdditionalModalImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="relative w-full max-w-[768px] max-h-[90vh] overflow-y-auto overflow-x-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={additionalModalImage}
                    alt="확대 보기"
                    className="w-full max-w-[768px] h-auto max-h-none object-contain rounded-lg block shrink-0"
                  />
                </motion.div>
                <button
                  type="button"
                  onClick={() => setAdditionalModalImage(null)}
                  className="fixed top-4 right-4 z-[60] text-white/90 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center"
                  aria-label="닫기"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-10" />
      </section>

      {/* ——— 푸터 (별도 유지) ——— */}
      <ContactSection />
    </main>
  )
}
