import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function AgOfficeDetail() {
  const agOfficeDemoUrl = import.meta.env.VITE_AG_OFFICE_DEMO_URL || 'http://127.0.0.1:3100'

  return (
    <ProjectDetailLayout
      title="Ag오피스"
      subtitle="마케팅 대행사 전용 AI플랫폼"
      category="Product"
      tools="Figma, V0, Cursor AI"
      responsibility="UI/UX 디자인 · React 기반 화면 구현"
      contribution="100%"
      period="2025.01 - 2025.05"
      siteUrl={agOfficeDemoUrl}
      siteButtonLabel="Demo 보기"
      heroVideoSrc="/images/project-1/project1-main.mov"
      images={[]}
      bottomImageRows={[
        {
          type: 'half',
          images: [
            { src: '/images/project-1/project1-img1.jpg', alt: 'Ag오피스 로그인 화면' },
            { src: '/images/project-1/project1-img2.jpg', alt: 'Ag오피스 무료 회원가입 화면' },
          ],
        },
        {
          type: 'full',
          image: { src: '/images/project-1/project1-img-full.png', alt: 'Ag오피스 대시보드 전체' },
        },
        {
          type: 'full',
          image: { src: '/images/project-1/project1-img3.jpg', alt: 'Ag오피스 매출현황 대시보드' },
        },
        {
          type: 'full',
          image: { src: '/images/project-1/project1-img4.jpg', alt: 'Ag오피스 계약현황' },
        },
        {
          type: 'full',
          image: { src: '/images/project-1/project1-img5.jpg', alt: 'Ag오피스 계약 목록' },
        },
      ]}
      description={[
        'Ag오피스는 마케팅 대행사가 쓰던 툴을 하나로 완성하는 마케팅 대행사 전용 AI 자동화 플랫폼입니다.',
        <>
          데이터를 주로 보여줘야하는 서비스 특성을 고려하여, 대시보드의 화면에 다양한 차트와 핵심 수치를 상단에 배치하여
          <br />
          한 눈에 수치파악을 할 수 있는 구조로 제작했습니다.
        </>,
      ]}
    />
  )
}
