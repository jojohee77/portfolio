// 성과 현황 관련 타입 정의

export type MetricType = 
  | "월 매출"
  | "평균 포스팅 비용"
  | "총 계약 매출"
  | "관리 업체"
  | "업체당 매월 평균"
  | "인원"
  | "인당 평균 매출"
  | "인당 평균 업체 수"

export type MonthKey = "1월" | "2월" | "3월" | "4월" | "5월" | "6월" | 
                       "7월" | "8월" | "9월" | "10월" | "11월" | "12월"

export type MonthlyMetricValue = {
  value: number
  change: number  // 전월 대비 증감률 (%)
}

// 팀별 지표 데이터 구조
export type TeamMetricData = {
  team: string
  metrics: {
    [K in MetricType]: {
      [M in MonthKey]: MonthlyMetricValue
    }
  }
}

// 테이블용 월별 데이터
export type MonthlyData = {
  [key: string]: { revenue: number; change: number }
}

// 포스팅 데이터
export type PostingData = {
  [key: string]: { 
    posting: number
    rework: number
    valid: number
    keywords: number
    top5Keywords: number
    avgRank: number
  }
}

// 팀 성과 기본 정보
export type TeamPerformance = {
  id: string
  name: string
  color: string
  colorLight: string
  monthlyRevenue: number
  totalContractRevenue: number
  companiesCount: number
  avgCompanyRevenue: number
  avgRevenuePerMember: number
  memberCount: number
}

// 개인 성과 정보
export type IndividualPerformance = {
  id: string
  name: string
  team: string
  position: string
  monthlyRevenue: number
  totalContractRevenue: number
  contractCount: number
  avgContractValue: number
  companiesCount: number
  avgMonthlyRevenue: number
  postingCount: number
  reworkCount: number
  validWorkCount: number
  teamColor: string
}

// 업체 정보
export type TeamCompany = {
  companyName: string
  region: string
  productName: string
  contractCount: number
  keywordCount?: number  // 키워드 개수 (옵셔널)
  contractPeriod: string
  manager: string
  totalAdCost: number
  monthlyAdCost: number
}

