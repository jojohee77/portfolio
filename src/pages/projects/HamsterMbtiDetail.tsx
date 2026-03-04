import ProjectDetailLayout from '@/components/projects/ProjectDetailLayout'

export default function HamsterMbtiDetail() {
  return (
    <ProjectDetailLayout
      title="햄찌MBTI"
      subtitle="햄찌 MBTI테스트 사이트"
      category="WEB"
      tools="ChatGPT, Cursor AI"
      responsibility="기획 · UI/UX 디자인 · React 기반 화면 구현"
      contribution="100%"
      period="2024.05 - 2024.07"
      siteUrl="https://hamzzi-mbti.onrender.com/"
      heroVideoSrc="/images/project-4/project4-main.mov"
      images={[]}
      bottomImageRows={[
        { type: 'half', images: [
          { src: '/images/project-4/project4-img1.jpg', alt: '햄찌MBTI 시작 화면' },
          { src: '/images/project-4/project4-img2.jpg', alt: '햄찌MBTI 질문 진행 화면' },
        ]},
        { type: 'half', images: [
          { src: '/images/project-4/project4-img3.jpg', alt: '햄찌MBTI 나의 햄찌 성격 결과' },
          { src: '/images/project-4/project4-img3-2.jpg', alt: '햄찌MBTI 결과 예시 - 자유로운 연예인/열정적인 활동가' },
        ]},
        { type: 'half', images: [
          { src: '/images/project-4/project4-img3-3.jpg', alt: '햄찌MBTI 결과 예시 - 모험을 즐기는 햄찌' },
          { src: '/images/project-4/project4-img3-4.jpg', alt: '햄찌MBTI 결과 예시 - 성실한 관리자 햄찌' },
        ]},
        { type: 'half', images: [
          { src: '/images/project-4/project4-img4.png', alt: '햄찌MBTI 성격 특성 상세' },
          { src: '/images/project-4/project4-img5.jpg', alt: '햄찌MBTI 궁합 햄찌 및 액션 버튼' },
        ]},
        { type: 'full', image: { src: '/images/project-4/project4-img6.jpg', alt: '햄찌MBTI 전체 햄찌 MBTI 모달' }},
      ]}
      description={[
        '햄찌 MBTI는 20개의 질문에 답하면 MBTI 유형에 맞는 햄스터 캐릭터를 보여주는 MBTI 테스트 웹사이트입니다.',
        'MBTI 테스트에 요즘 유행하는 AI 캐릭터 요소를 결합해 결과를 보는 재미와 몰입감을 높였으며, 기획부터 콘텐츠 구성, AI 이미지 생성은 ChatGPT를 활용해 도출하고, 페이지 구현은 Cursor AI를 활용해 빠르게 완성했습니다.',
      ]}
    />
  )
}
