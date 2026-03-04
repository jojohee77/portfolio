import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function GongjaDetail() {
  return (
    <ProjectDetailLayout
      title="공짜시대"
      subtitle="광고포인트로 게임과 쇼핑을하는 리워드앱"
      category="APP"
      tools="photoshop,illustrator"
      responsibility="UI/UX 디자인"
      contribution="100%"
      period="2023"
      imageLayout="full"
      images={[
        { src: '/images/project-7/project7-main.jpg', alt: '공짜시대 메인 화면' },
        { src: '/images/project-7/project7-img2.jpg', alt: '공짜시대 이벤트·리스트 화면' },
        { src: '/images/project-7/project7-img3.jpg', alt: '공짜시대 프로모션·게임 화면' },
      ]}
      description={[
        '포인트를 통해 게임과 쇼핑 혜택을 제공하는 앱 서비스로, UX/UI 디자인 전반을 담당한 프로젝트입니다.',
        '메인 화면부터 게임 화면, 앱 캐릭터 디자인까지 전체 UI를 설계했으며, 사용자가 어떤 혜택을 받을 수 있는지 한눈에 이해할 수 있도록 직관적인 구조와 시각적 요소에 집중해 디자인했습니다.',
      ]}
    />
  )
}
