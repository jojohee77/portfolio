// 지역 데이터 타입 정의
export interface RegionData {
  sidonm: string
  sggNm: string
  umdNm: string
  code: string
  type: string
  aliases: string[]
  chosung: string
}

export interface SidoInfo {
  name: string
  file: string
  population?: number
}

export interface RegionIndex {
  version: string
  generatedAt: string
  sido: SidoInfo[]
  counts: Record<string, number>
  total: number
}

// 시도별 인구 데이터 (2023년 기준, 단위: 만명)
const SIDO_POPULATION_DATA: Record<string, number> = {
  '서울특별시': 972.8,
  '부산광역시': 339.2,
  '인천광역시': 295.5,
  '대구광역시': 240.3,
  '대전광역시': 144.2,
  '광주광역시': 144.0,
  '울산광역시': 113.4,
  '세종특별자치시': 38.1,
  '경기도': 1353.0,
  '강원특별자치도': 153.7,
  '충청북도': 159.7,
  '충청남도': 211.0,
  '전북특별자치도': 179.9,
  '전라남도': 185.0,
  '경상북도': 262.0,
  '경상남도': 333.5,
  '제주특별자치도': 67.2
}

// 시도 목록 로드 함수 (인구순 정렬)
export async function loadSidoList(): Promise<SidoInfo[]> {
  try {
    console.log('시도 목록 로드 시작...')
    const response = await fetch('/data/raw/index.json')
    
    if (!response.ok) {
      throw new Error(`index.json 로드 실패: ${response.status}`)
    }
    
    const indexData: RegionIndex = await response.json()
    
    // 인구 데이터 추가 및 인구순으로 정렬
    const sidoListWithPopulation = indexData.sido.map(sido => ({
      ...sido,
      population: SIDO_POPULATION_DATA[sido.name] || 0
    })).sort((a, b) => (b.population || 0) - (a.population || 0))
    
    console.log('시도 목록 로드 완료 (인구순 정렬):', sidoListWithPopulation.length, '개')
    return sidoListWithPopulation
  } catch (error) {
    console.error('시도 목록 로드 실패:', error)
    return []
  }
}

// 특정 시도의 시군구 목록 로드 함수
export async function loadSggList(sidoFile: string): Promise<RegionData[]> {
  try {
    console.log(`${sidoFile} 시군구 데이터 로드 시작...`)
    const response = await fetch(`/data/raw/${sidoFile}`)
    
    if (!response.ok) {
      throw new Error(`${sidoFile} 로드 실패: ${response.status}`)
    }
    
    const data: RegionData[] = await response.json()
    
    // 시군구만 추출 (중복 제거)
    const sggMap = new Map<string, RegionData>()
    
    data.forEach(region => {
      if (region.sggNm && !sggMap.has(region.sggNm)) {
        sggMap.set(region.sggNm, {
          sidonm: region.sidonm,
          sggNm: region.sggNm,
          umdNm: '', // 시군구는 동명이 없음
          code: region.code.substring(0, 8), // 시군구 코드 (8자리)
          type: '시군구',
          aliases: [`${region.sidonm} ${region.sggNm}`],
          chosung: region.chosung.split(' ').slice(0, 2).join(' ') // 시도 + 시군구 초성
        })
      }
    })
    
    const sggData = Array.from(sggMap.values())
    console.log(`${sidoFile} 시군구 로드 완료:`, sggData.length, '개')
    return sggData
  } catch (error) {
    console.error(`${sidoFile} 시군구 로드 실패:`, error)
    return []
  }
}

// 특정 시군구의 동읍면 목록 로드 함수
export async function loadUmdList(sidoFile: string, sggName: string): Promise<RegionData[]> {
  try {
    console.log(`${sidoFile} ${sggName} 동읍면 데이터 로드 시작...`)
    const response = await fetch(`/data/raw/${sidoFile}`)
    
    if (!response.ok) {
      throw new Error(`${sidoFile} 로드 실패: ${response.status}`)
    }
    
    const data: RegionData[] = await response.json()
    
    // 특정 시군구의 동읍면만 필터링
    const umdData = data.filter(region => {
      // 시군구명으로 필터링하고 동읍면만 추출
      return region.sggNm === sggName && 
             region.umdNm !== ''
    })
    
    console.log(`${sggName} 동읍면 로드 완료:`, umdData.length, '개')
    return umdData
  } catch (error) {
    console.error(`${sggName} 동읍면 로드 실패:`, error)
    return []
  }
}

// 전체 지역 데이터 로드 함수 (기존 호환성 유지)
export async function loadRegionData(): Promise<RegionData[]> {
  try {
    console.log('전체 지역 데이터 로드 시작...')
    
    const sidoList = await loadSidoList()
    const allRegions: RegionData[] = []
    
    // 각 시도별로 데이터 로드 (모든 시도)
    for (let i = 0; i < sidoList.length; i++) {
      const sido = sidoList[i]
      try {
        const response = await fetch(`/data/raw/${sido.file}`)
        
        if (!response.ok) {
          console.warn(`${sido.file} 로드 실패: ${response.status}`)
          continue
        }
        
        const data: RegionData[] = await response.json()
        allRegions.push(...data)
        console.log(`${sido.name}: ${data.length}개 지역 로드 완료`)
      } catch (error) {
        console.warn(`Failed to load ${sido.file}:`, error)
      }
    }
    
    console.log('총 로드된 지역 수:', allRegions.length)
    return allRegions
  } catch (error) {
    console.error('Failed to load region data:', error)
    return []
  }
}

// 지역 검색을 위한 옵션 생성 함수
export function createRegionOptions(regions: RegionData[]) {
  const sidoMap = new Map<string, Set<string>>()
  const sggMap = new Map<string, Set<string>>()
  
  regions.forEach(region => {
    const sido = region.sidonm
    const sgg = region.sggNm
    const umd = region.umdNm
    
    // 시도별 시군구 매핑
    if (!sidoMap.has(sido)) {
      sidoMap.set(sido, new Set())
    }
    sidoMap.get(sido)!.add(sgg)
    
    // 시군구별 읍면동 매핑
    const sggKey = `${sido} ${sgg}`
    if (!sggMap.has(sggKey)) {
      sggMap.set(sggKey, new Set())
    }
    sggMap.get(sggKey)!.add(umd)
  })
  
  return {
    sido: Array.from(sidoMap.keys()).map(sido => ({
      value: sido,
      label: sido,
      children: Array.from(sidoMap.get(sido)!).map(sgg => ({
        value: `${sido} ${sgg}`,
        label: sgg,
        children: Array.from(sggMap.get(`${sido} ${sgg}`) || []).map(umd => ({
          value: `${sido} ${sgg} ${umd}`,
          label: umd
        }))
      }))
    }))
  }
}

// 지역명 검색 함수
export function searchRegions(regions: RegionData[], query: string): RegionData[] {
  if (!query.trim()) return []
  
  const normalizedQuery = query.toLowerCase().trim()
  
  return regions.filter(region => {
    const fullName = `${region.sidonm} ${region.sggNm} ${region.umdNm}`.toLowerCase()
    const aliases = region.aliases.map(alias => alias.toLowerCase())
    
    return fullName.includes(normalizedQuery) || 
           aliases.some(alias => alias.includes(normalizedQuery)) ||
           region.chosung.includes(normalizedQuery)
  })
}

// 지역 코드로 지역 정보 찾기
export function findRegionByCode(regions: RegionData[], code: string): RegionData | undefined {
  return regions.find(region => region.code === code)
}

// 지역명으로 지역 정보 찾기
export function findRegionByName(regions: RegionData[], name: string): RegionData | undefined {
  return regions.find(region => {
    const fullName = `${region.sidonm} ${region.sggNm} ${region.umdNm}`
    return fullName === name || region.aliases.includes(name)
  })
}
