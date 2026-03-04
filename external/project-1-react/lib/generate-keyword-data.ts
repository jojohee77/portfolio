// 키워드 데이터 생성 유틸리티

const keywords = [
  "AI 솔루션", "봄 패션", "유기농 레시피", "디지털 마케팅", "홈 트레이닝",
  "비건 베이커리", "스마트홈 기기", "전기차 충전", "반려동물 용품", "친환경 제품",
  "온라인 교육", "메타버스", "NFT 플랫폼", "클라우드 서비스", "빅데이터 분석",
  "사이버 보안", "블록체인", "핀테크 솔루션", "인공지능 챗봇", "IoT 센서",
  "드론 촬영", "VR 콘텐츠", "3D 프린팅", "로봇 자동화", "스마트팩토리",
  "그린에너지", "수소차", "ESG 경영", "탄소중립", "재생에너지"
]

const clients = [
  "스마트테크", "에듀테크", "패션하우스", "그린푸드", "헬스앤핏",
  "베이크하우스", "홈오토", "이브이차저", "펫프렌즈", "에코라이프",
  "런앤런", "메타월드", "디지털에셋", "클라우드나인", "데이터인사이트",
  "시큐어넷", "체인링크", "페이먼트플러스", "챗봇팩토리", "스마트센서",
  "스카이뷰", "버추얼스튜디오", "쓰리디메이커", "로보틱스", "팩토리4.0",
  "그린파워", "하이드로모빌", "지속가능", "제로카본", "리뉴에너지"
]

const competitionLevels: Array<"아주좋음" | "좋음" | "보통" | "나쁨" | "아주나쁨"> = [
  "아주좋음", "좋음", "보통", "나쁨", "아주나쁨"
]

const managers = ["김마케터", "이디자이너", "박영양사", "정분석가", "최기획자", "강개발자", "윤전략가"]
const teams = ["디지털마케팅팀", "크리에이티브팀", "브랜드팀", "데이터분석팀", "전략기획팀"]

export function generateKeywordData(count: number = 30) {
  const data = []
  const dataMap = new Map<string, any>() // 키워드-고객사 조합을 저장

  // 중복 키워드 데이터 먼저 추가
  const duplicateKeywords = [
    { keyword: "AI 솔루션", client: "스마트테크" },
    { keyword: "AI 솔루션", client: "에듀테크" },
    { keyword: "AI 솔루션", client: "패션하우스" }
  ]

  for (let i = 0; i < duplicateKeywords.length; i++) {
    const item = duplicateKeywords[i]
    const totalPostings = Math.floor(Math.random() * 10) + 1
    const reworkCount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0
    const top5Rate = Math.floor(Math.random() * 50) + 50
    const top1Rate = Math.floor(Math.random() * 40) + 10
    const competitionLevel = competitionLevels[Math.floor(Math.random() * competitionLevels.length)]
    const averageRank = parseFloat((Math.random() * 8 + 1).toFixed(1))
    const bestRank = Math.floor(Math.random() * 5) + 1
    const worstRank = Math.floor(Math.random() * 15) + 10
    const monthlySearchVolume = Math.floor(Math.random() * 20000) + 3000
    const monthlyPostVolume = Math.floor(Math.random() * 100) + 20
    const blogSaturation = parseFloat((Math.random() * 60 + 10).toFixed(1))

    // 포스팅 상세 생성
    const postingDetails = Array.from({ length: totalPostings }, (_, idx) => ({
      id: i * 100 + idx + 1,
      title: `${item.keyword} 관련 포스팅 ${idx + 1}`,
      client: item.client,
      blogUrl: `https://blog${i}.example.com/post-${idx}`,
      registeredDate: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      currentRank: Math.floor(Math.random() * 20) + 1,
      category: (idx < totalPostings - reworkCount ? "신규" : "재작업") as "신규" | "재작업",
      manager: managers[Math.floor(Math.random() * managers.length)],
      teamName: teams[Math.floor(Math.random() * teams.length)],
      rankings: [{
        keyword: item.keyword,
        rank: Math.floor(Math.random() * 20) + 1,
        change: Math.floor(Math.random() * 11) - 5,
        history: [
          { date: "2024-03-01", rank: Math.floor(Math.random() * 20) + 1 },
          { date: "2024-03-08", rank: Math.floor(Math.random() * 20) + 1 },
        ]
      }],
      lastChecked: "2024-03-08"
    }))

    // 순위 히스토리 생성 (최근 30일)
    const rankingHistory = Array.from({ length: 30 }, (_, idx) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - idx)) // 30일 전부터 오늘까지
      return {
        date: date.toISOString().split('T')[0],
        rank: Math.floor(Math.random() * 20) + 1,
        searchVolume: monthlySearchVolume + Math.floor(Math.random() * 2000) - 1000,
        monthlyPosts: monthlyPostVolume + Math.floor(Math.random() * 10) - 5
      }
    })

    const key = `${item.keyword}-${item.client}`
    if (!dataMap.has(key)) {
      const keywordData = {
        keyword: item.keyword,
        totalPostings,
        reworkCount,
        top5Rate,
        top1Rate,
        competitionLevel,
        averageRank,
        bestRank,
        worstRank,
        clients: [item.client],
        monthlySearchVolume,
        monthlyPostVolume,
        blogSaturation,
        postingDetails,
        rankingHistory,
        isTarget: i < 3 // 처음 3개를 타겟 키워드로 설정
      }
      dataMap.set(key, keywordData)
      data.push(keywordData)
    }
  }

  // 기존 키워드 데이터 생성
  for (let i = 0; i < count; i++) {
    const keyword = keywords[i % keywords.length] + (i >= keywords.length ? ` ${Math.floor(i / keywords.length) + 1}` : "")
    const totalPostings = Math.floor(Math.random() * 10) + 1
    const reworkCount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0
    const top5Rate = Math.floor(Math.random() * 50) + 50
    const top1Rate = Math.random() * 40 + 10
    const competitionLevel = competitionLevels[Math.floor(Math.random() * competitionLevels.length)]
    const averageRank = parseFloat((Math.random() * 8 + 1).toFixed(1))
    const bestRank = Math.floor(Math.random() * 5) + 1
    const worstRank = Math.floor(Math.random() * 15) + 10
    // 처음 5개만 고객사 없음, 나머지는 고객사 포함
    const hasNoClient = i < 5
    const clientCount = hasNoClient ? 0 : Math.floor(Math.random() * 3) + 1
    const relatedClients = hasNoClient ? [] : Array.from({ length: clientCount }, (_, idx) =>
      clients[(i + idx) % clients.length]
    )
    const monthlySearchVolume = Math.floor(Math.random() * 20000) + 3000
    const monthlyPostVolume = Math.floor(Math.random() * 100) + 20
    const blogSaturation = parseFloat((Math.random() * 60 + 10).toFixed(1))

    // 포스팅 상세 생성
    const postingDetails = Array.from({ length: totalPostings }, (_, idx) => ({
      id: i * 100 + idx + 1,
      title: `${keyword} 관련 포스팅 ${idx + 1}`,
      client: relatedClients[idx % relatedClients.length],
      blogUrl: `https://blog${i}.example.com/post-${idx}`,
      registeredDate: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      currentRank: Math.floor(Math.random() * 20) + 1,
      category: (idx < totalPostings - reworkCount ? "신규" : "재작업") as "신규" | "재작업",
      manager: managers[Math.floor(Math.random() * managers.length)],
      teamName: teams[Math.floor(Math.random() * teams.length)],
      rankings: [{
        keyword,
        rank: Math.floor(Math.random() * 20) + 1,
        change: Math.floor(Math.random() * 11) - 5,
        history: [
          { date: "2024-03-01", rank: Math.floor(Math.random() * 20) + 1 },
          { date: "2024-03-08", rank: Math.floor(Math.random() * 20) + 1 },
        ]
      }],
      lastChecked: "2024-03-08"
    }))

    // 순위 히스토리 생성 (최근 30일)
    const rankingHistory = Array.from({ length: 30 }, (_, idx) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - idx)) // 30일 전부터 오늘까지
      return {
        date: date.toISOString().split('T')[0],
        rank: Math.floor(Math.random() * 20) + 1,
        searchVolume: monthlySearchVolume + Math.floor(Math.random() * 2000) - 1000,
        monthlyPosts: monthlyPostVolume + Math.floor(Math.random() * 10) - 5
      }
    })

    // 고객사가 있는 경우에만 각 고객사별로 데이터 생성, 없으면 하나의 데이터만 생성
    if (relatedClients.length > 0) {
      relatedClients.forEach(client => {
        const key = `${keyword}-${client}`
        if (!dataMap.has(key)) {
          const keywordData = {
            keyword,
            totalPostings,
            reworkCount,
            top5Rate,
            top1Rate,
            competitionLevel,
            averageRank,
            bestRank,
            worstRank,
            clients: [client],
            monthlySearchVolume,
            monthlyPostVolume,
            blogSaturation,
            postingDetails,
            rankingHistory,
            isTarget: i < 3 // 처음 3개를 타겟 키워드로 설정
          }
          dataMap.set(key, keywordData)
          data.push(keywordData)
        }
      })
    } else {
      // 고객사가 없는 경우 하나의 데이터만 생성
      const key = `${keyword}-no-client`
      if (!dataMap.has(key)) {
        const keywordData = {
          keyword,
          totalPostings,
          reworkCount,
          top5Rate,
          top1Rate,
          competitionLevel,
          averageRank,
          bestRank,
          worstRank,
          clients: [],
          monthlySearchVolume,
          monthlyPostVolume,
          blogSaturation,
          postingDetails,
          rankingHistory,
          isTarget: i < 3 // 처음 3개를 타겟 키워드로 설정
        }
        dataMap.set(key, keywordData)
        data.push(keywordData)
      }
    }
  }

  return data
}
