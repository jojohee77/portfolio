import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function HiddenAdDetail() {
  return (
    <ProjectDetailLayout
      title="히든애드"
      subtitle="마케팅 소개 웹 사이트"
      category="WEB"
      tools="Figma, HTML, CSS, JavaScript"
      responsibility="UI/UX 디자인 · 퍼블리싱"
      contribution="100%"
      period="2024"
      siteUrl="#"
      heroImageSrc="/images/project-5/project5-main.gif"
      images={[
        { src: '/images/project-5/project5-img1.jpg', alt: '히든애드 웹사이트 섹션 1' },
        { src: '/images/project-5/project5-img2.jpg', alt: '히든애드 웹사이트 섹션 2' },
      ]}
      description={[
        '마케팅 업체의 서비스와 콘텐츠를 효과적으로 전달하기 위해 제작한 기업형 웹사이트입니다.',
        '시선을 사로잡는 비비드한 컬러와 콘텐츠 이해를 돕는 이미지를 중심으로 화면을 구성해, 정보 전달력이 높도록 기획하고 디자인했습니다.',
        '레이아웃은 Bootstrap 기반으로 설계하고, 세부 페이지는 HTML, CSS를 활용한 하드코딩 퍼블리싱으로 디자인 의도를 그대로 구현했습니다.',
      ]}
    />
  )
}

