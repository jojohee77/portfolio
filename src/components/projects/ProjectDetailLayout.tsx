import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ContactSection from '@/components/shared/ContactSection'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import ScrollTopButton from '@/components/ScrollTopButton'

/** 사용 툴 명칭 → 아이콘 경로 (제공해주신 명칭에 맞게 매핑) */
const TOOL_ICONS: Record<string, string> = {
  Figma: '/images/ai-figma.png',
  V0: '/images/ai-v0app.png',
  'Cursor AI': '/images/ai-cursor.png',
  Cursor: '/images/ai-cursor.png',
  ChatGPT: '/images/ai-chatGPT.png',
  HTML: '/images/skill-1.png',
  html: '/images/skill-1.png',
  CSS: '/images/skill-2.png',
  css: '/images/skill-2.png',
  JavaScript: '/images/skill-3.png',
  javascript: '/images/skill-3.png',
  Photoshop: '/images/skill-4.png',
  photoshop: '/images/skill-4.png',
  포토샵: '/images/skill-4.png',
  Illustrator: '/images/skill-5.png',
  illustrator: '/images/skill-5.png',
  일러스트: '/images/skill-5.png',
}

function getToolIcon(name: string): string | undefined {
  const trimmed = name.trim()
  return TOOL_ICONS[trimmed] ?? TOOL_ICONS[trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()]
}

interface ProjectImage {
  src: string
  alt: string
}

type ProjectCategory = 'Product' | 'WEB' | 'APP'

interface ProjectDetailLayoutProps {
  title: string
  subtitle?: string
  category: ProjectCategory
  tools: string
  responsibility: string
  contribution: string
  period: string
  siteUrl?: string
  siteButtonLabel?: string
  images: ProjectImage[]
  description: React.ReactNode[]
  /** 상단에 자동 재생되는 소개 영상 (선택) */
  heroVideoSrc?: string
  /** 상단에 고정 이미지로 보여줄 메인 비주얼 (선택, 예: GIF) */
  heroImageSrc?: string
  /** 프로젝트 이미지 섹션 레이아웃 (기본/가로 풀사이즈) */
  imageLayout?: 'default' | 'full'
  /** 하단 2×2 그리드로 보여줄 추가 이미지 (선택) */
  bottomImages?: ProjectImage[]
  /** 하단 이미지 행 단위 레이아웃: full(가로 풀) / half(두 장 반반 나열) (선택, 있으면 bottomImages 대신 사용) */
  bottomImageRows?: Array<
    | { type: 'full'; image: ProjectImage }
    | { type: 'half'; images: [ProjectImage, ProjectImage] }
  >
}

export default function ProjectDetailLayout({
  title,
  subtitle: _subtitle,
  category,
  tools,
  responsibility,
  contribution,
  period: _period,
  siteUrl,
  siteButtonLabel,
  images,
  description,
  heroVideoSrc,
  heroImageSrc,
  imageLayout,
  bottomImages,
  bottomImageRows,
}: ProjectDetailLayoutProps) {
  const buttonHref = siteUrl ?? '#'
  const toolList = tools.split(',').map((t) => t.trim()).filter(Boolean)

  return (
    <main className="bg-[#2b2b2b] min-h-screen">
      {/* 뒤로가기 버튼 - 최소 여백 */}
      <div className="py-4 px-6 sm:px-10 md:px-16">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-[#f4f4f4] hover:text-[#29e160] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>돌아가기</span>
        </Link>
      </div>

      {/* 상단 요약 카드 (시안 레이아웃) */}
      <section className="pt-4 pb-8 sm:pt-6 sm:pb-10 md:pt-8 md:pb-12">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto px-0 sm:px-2 md:px-4">
            {/* 배지 + 타이틀 + 버튼 */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <CategoryBadge label={category} />
                <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#f4f4f4]">
                  {title}
                </h1>
              </div>

              {siteUrl && (
                <a
                  href={buttonHref}
                  target="_blank"
                  rel="noreferrer"
                  className="self-start md:self-center inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#29e160] text-[#2b2b2b] text-sm sm:text-base font-semibold hover:opacity-90 transition-colors"
                >
                  {siteButtonLabel ?? '사이트 보기'}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>

            {/* 메타 정보 - 모바일: 세로 정렬, 데스크톱: 가로 나열 / 사용 툴: 아이콘+텍스트 */}
            <div className="mt-4 text-[18px] flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                <span className="text-[#29e160] font-semibold whitespace-nowrap">사용 툴</span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {toolList.map((name) => {
                    const iconSrc = getToolIcon(name)
                    return (
                      <div
                        key={name}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-full bg-[#3b3b3b]"
                      >
                        {iconSrc && (
                          <img
                            src={iconSrc}
                            alt=""
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <span className="text-[11px] sm:text-xs text-[#e9e9e9]">{name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[#29e160] font-semibold whitespace-nowrap">담당 역할</span>
                <span className="text-[#e9e9e9]">{responsibility}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[#29e160] font-semibold whitespace-nowrap">참여도</span>
                <span className="text-[#e9e9e9]">{contribution}</span>
              </div>
            </div>

            {/* 소개 본문 - 추가 간격 없이 line-height만 사용 */}
            <div className="mt-6 sm:mt-7 md:mt-8 text-[#e9e9e9] text-sm sm:text-base md:text-lg leading-relaxed">
              {description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 상단 소개 영상 또는 이미지 (선택) - 요약 텍스트 하단에 위치 */}
      {heroVideoSrc && (
        <section className="pt-0 pb-8 sm:pb-10 md:pb-12">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden bg-black">
              <video
                src={heroVideoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {!heroVideoSrc && heroImageSrc && (
        <section className="pt-0 pb-8 sm:pb-10 md:pb-12">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden bg-black">
              <img
                src={heroImageSrc}
                alt={`${title} 메인 이미지`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* 프로젝트 이미지 갤러리 */}
      {images.length > 0 &&
        (imageLayout === 'full' ? (
          <section className="py-12 sm:py-16">
            <div className="container-custom">
              <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6">
                {images.map((image) => (
                  <div key={image.src} className="bg-[#3b3b3b] rounded-2xl overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto object-contain max-w-full"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-12 sm:py-16">
            <div className="container-custom">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {images.map((image) => (
                  <div key={image.src} className="bg-[#3b3b3b] rounded-2xl overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

      {/* 하단 이미지 (높이 제한 없음, 가로 잘림 방지 · 웹사이트 화면용) */}
      {bottomImageRows && bottomImageRows.length > 0 ? (
        <section className="py-8 sm:py-10 md:py-12">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6">
              {bottomImageRows.map((row, idx) =>
                row.type === 'full' ? (
                  <div
                    key={idx}
                    className="bg-[#3b3b3b] rounded-2xl overflow-hidden"
                  >
                    <img
                      src={row.image.src}
                      alt={row.image.alt}
                      className="w-full h-auto object-contain max-w-full"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  >
                    {row.images.map((image) => (
                      <div
                        key={image.src}
                        className="bg-[#3b3b3b] rounded-2xl overflow-hidden"
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-auto object-contain max-w-full"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      ) : bottomImages && bottomImages.length > 0 ? (
        <section className="py-8 sm:py-10 md:py-12">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto grid grid-cols-1 gap-4 sm:gap-6">
              {bottomImages.map((image) => (
                <div
                  key={image.src}
                  className="bg-[#3b3b3b] rounded-2xl overflow-hidden"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-contain max-w-full"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 공통 Contact 섹션 */}
      <ContactSection />

      {/* 스크롤 1000px 이상일 때 맨 위로 버튼 */}
      <ScrollTopButton threshold={1000} />
    </main>
  )
}

