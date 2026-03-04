import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function BbagleAiDetail() {
  return (
    <ProjectDetailLayout
      title="빠글AI"
      subtitle="AI 블로그 자동 포스팅 서비스"
      category="Product"
      tools="Figma, V0, Cursor AI"
      responsibility="UI/UX 디자인 · React 기반 화면 구현"
      contribution="100%"
      period="2024.10 - 2025.03"
      siteUrl="https://bbagle.ai/intro"
      heroVideoSrc="/images/project-2/project2-main.mov"
      images={[]}
      bottomImages={[
        { src: '/images/project-2/project2-img1.JPG', alt: '빠글AI 랜딩·기능 안내' },
        { src: '/images/project-2/project2-img2.JPG', alt: '빠글AI 포스팅 등록' },
        { src: '/images/project-2/project2-img3.JPG', alt: '빠글AI 캘린더 일정' },
        { src: '/images/project-2/project2-img4.JPG', alt: '빠글AI 채널 연동' },
        { src: '/images/project-2/project2-img5.png', alt: '빠글AI 황금 키워드' },
        { src: '/images/project-2/project2-img6.JPG', alt: '빠글AI 실시간 검색어' },
        { src: '/images/project-2/project2-img7.png', alt: '빠글AI 멤버십' },
      ]}
      description={[
        '빠글AI는 키워드만 입력하면 본문 작성, 이미지 생성, 블로그 포스팅까지 약 30초 내에 자동으로 완성되는 블로그 자동 포스팅 AI 서비스입니다.',
        '사용자가 핵심 서비스에 집중 할 수 있도록 최소 입력 → 빠른 결과 흐름으로 설계했습니다.',
      ]}
    />
  )
}
