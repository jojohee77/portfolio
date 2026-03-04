import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function GazetAiDetail() {
  return (
    <ProjectDetailLayout
      title="가제트AI"
      subtitle="AI 블로그 글쓰기"
      category="Product"
      tools="Figma, HTML, CSS, JavaScript"
      responsibility="UI/UX 디자인 · 퍼블리싱"
      contribution="100%"
      period="2024.08 - 2024.12"
      siteUrl="https://gazet.ai/"
      heroVideoSrc="/images/project-3/project3-main.mov"
      images={[]}
      bottomImages={[
        { src: '/images/project-3/project3-img1.png', alt: '가제트AI AI 글쓰기 메인' },
        { src: '/images/project-3/project3-img2.jpg', alt: '가제트AI 정보성 블로그 v2' },
        { src: '/images/project-3/project3-img3.jpg', alt: '가제트AI 유튜브로 블로그 쓰기' },
        { src: '/images/project-3/project3-img4.jpg', alt: '가제트AI AI 이미지 생성하기' },
      ]}
      description={[
        '가제트AI는 키워드만 입력하면 블로그 글과 마케팅 콘텐츠를 자동으로 생성할 수 있는 블로그 특화 AI 글쓰기 서비스입니다.',
        '사용자가 목적에 맞는 도구를 빠르게 선택할 수 있도록 AI 글쓰기 도구를 메인 화면에 배치해 직관적으로 탐색할 수 있는 구조로 설계했습니다.',
        'UI 시안은 Figma를 통해 제작했으며, HTML, CSS, jQuery, Bootstrap 기반의 하드코딩 퍼블리싱으로 디자인을 구현했습니다.',
      ]}
    />
  )
}
