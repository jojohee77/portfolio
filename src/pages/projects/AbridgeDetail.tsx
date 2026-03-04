import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function AbridgeDetail() {
  return (
    <ProjectDetailLayout
      title="에이브릿지"
      subtitle="배드민턴 레슨장 소개 웹 사이트"
      category="WEB"
      tools="Photoshop, HTML, CSS, JavaScript"
      responsibility="UI/UX 디자인 · 퍼블리싱"
      contribution="100%"
      period="2023"
      siteUrl="/images/project-6/html/index.html"
      siteButtonLabel="Demo 보기"
      heroImageSrc="/images/project-6/project6-main.gif"
      imageLayout="full"
      images={[
        { src: '/images/project-6/project6-img-full.jpg', alt: '에이브릿지 배드민턴 아카데미 전체' },
        { src: '/images/project-6/project6-img-full2.png', alt: '에이브릿지 소개 페이지' },
        { src: '/images/project-6/project6-img1.jpg', alt: '에이브릿지 웹사이트 섹션 1' },
        { src: '/images/project-6/project6-img2.jpg', alt: '에이브릿지 웹사이트 섹션 2' },
      ]}
      description={[
        '배드민턴 레슨장을 소개하기 위해 제작한 홍보형 웹사이트입니다.',
        '실사 이미지 중심의 일반적인 구성에서 벗어나, 스크롤에 따라 움직이는 그래픽 요소를 적용해 배드민턴의 역동적인 움직임과 에너지를 시각적으로 표현했습니다.',
        '또한 사용자가 레슨 정보와 주요 콘텐츠를 쉽게 탐색할 수 있도록 화면 흐름을 단순하게 구성해, 직관적인 이용 경험에 중점을 두고 기획·디자인했습니다.',
      ]}
    />
  )
}
