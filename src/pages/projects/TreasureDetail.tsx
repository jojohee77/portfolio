import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function TreasureDetail() {
  return (
    <ProjectDetailLayout
      title="트레저"
      subtitle="해저 스포츠를 한곳에 모아둔 플랫폼"
      category="APP"
      tools="photoshop,illustrator"
      responsibility="UI/UX 디자인"
      contribution="100%"
      period="2022"
      imageLayout="full"
      images={[
        { src: '/images/project-9/project9-main.jpg', alt: '트레저 메인 화면' },
        { src: '/images/project-9/project9-img1.jpg', alt: '트레저 예약·리스트 화면' },
        { src: '/images/project-9/project9-img2.jpg', alt: '트레저 예약·결제 화면' },
      ]}
      description={[
        '트레저는 해저 스포츠 예약을 콘셉트로 기획한 앱 디자인 프로젝트입니다.',
        'UX/UI 디자인 전반에 100% 참여했으며, 종목 탐색부터 예약까지 이어지는 흐름을 직관적으로 구성하는 데 집중했습니다.',
      ]}
    />
  )
}
