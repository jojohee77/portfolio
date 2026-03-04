import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function YaguinDetail() {
  return (
    <ProjectDetailLayout
      title="야구인닷컴"
      subtitle="전국 야구레슨장 찾기 플랫폼"
      category="APP"
      tools="photoshop,illustrator"
      responsibility="UI/UX 디자인"
      contribution="100%"
      period="2023"
      imageLayout="full"
      images={[
        { src: '/images/project-8/project8-main.jpg', alt: '야구인닷컴 메인 화면' },
        { src: '/images/project-8/project8-img1.jpg', alt: '야구인닷컴 레슨장 정보·리스트 화면' },
        { src: '/images/project-8/project8-img2.jpg', alt: '야구인닷컴 예약·상세 화면' },
      ]}
      description={[
        '야구인닷컴은 전국 야구 레슨장 정보를 모아 탐색할 수 있는 서비스 앱입니다.',
        'UX/UI 디자인을 담당하며, 사용자가 지역별 레슨장 정보를 한눈에 확인하고 쉽게 비교할 수 있도록 아이콘과 이미지 중심의 정보 구조로 설계했습니다.',
      ]}
    />
  )
}
