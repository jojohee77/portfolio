const fs = require('fs');
const path = require('path');

// 행정안전부 주소정보시스템 API를 사용해서 모든 지역 데이터를 수집하는 스크립트
const API_BASE_URL = 'https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes';

async function fetchRegions(parentCode = null) {
  const params = new URLSearchParams({
    regcode_pattern: parentCode ? `${parentCode}*` : '*',
    is_ignore_zero: 'true'
  });

  try {
    const response = await fetch(`${API_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    const data = await response.json();
    return data.regcodes || [];
  } catch (error) {
    console.error(`API 호출 실패 (parentCode: ${parentCode}):`, error.message);
    return [];
  }
}

async function collectAllRegions() {
  console.log('🚀 전국 지역 데이터 수집 시작...');
  
  const allRegions = {
    cities: [],      // 시/도
    districts: [],   // 시/구/군
    neighborhoods: [] // 동/읍/면
  };

  try {
    // 1단계: 시/도 데이터 수집
    console.log('📋 시/도 데이터 수집 중...');
    const cities = await fetchRegions();
    allRegions.cities = cities.filter(region => region.code.length === 2);
    console.log(`✅ 시/도 ${allRegions.cities.length}개 수집 완료`);

    // 2단계: 각 시/도별 시/구/군 데이터 수집
    console.log('📋 시/구/군 데이터 수집 중...');
    for (const city of allRegions.cities) {
      console.log(`  - ${city.name} 처리 중...`);
      const districts = await fetchRegions(city.code);
      const filteredDistricts = districts.filter(region => {
        const name = region.name;
        return !name.includes('동') && 
               !name.includes('읍') && 
               !name.includes('면') && 
               !name.includes('가') &&
               !name.includes('로') &&
               name.split(' ').length <= 2;
      });
      allRegions.districts.push(...filteredDistricts);
      
      // API 호출 제한을 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log(`✅ 시/구/군 ${allRegions.districts.length}개 수집 완료`);

    // 3단계: 각 시/구/군별 동/읍/면 데이터 수집
    console.log('📋 동/읍/면 데이터 수집 중...');
    let processedCount = 0;
    for (const district of allRegions.districts) {
      processedCount++;
      console.log(`  - [${processedCount}/${allRegions.districts.length}] ${district.name} 처리 중...`);
      
      const neighborhoods = await fetchRegions(district.code);
      const filteredNeighborhoods = neighborhoods.filter(region => {
        const name = region.name;
        return name.includes('동') || name.includes('읍') || name.includes('면');
      });
      allRegions.neighborhoods.push(...filteredNeighborhoods);
      
      // API 호출 제한을 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    console.log(`✅ 동/읍/면 ${allRegions.neighborhoods.length}개 수집 완료`);

    // 4단계: 데이터를 파일로 저장
    const outputDir = path.join(__dirname, '../data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // JSON 파일로 저장
    fs.writeFileSync(
      path.join(outputDir, 'all-regions.json'),
      JSON.stringify(allRegions, null, 2),
      'utf8'
    );

    // TypeScript 인터페이스용 데이터 생성
    const tsData = generateTypeScriptData(allRegions);
    fs.writeFileSync(
      path.join(outputDir, 'regions-data.ts'),
      tsData,
      'utf8'
    );

    console.log('🎉 모든 지역 데이터 수집 및 저장 완료!');
    console.log(`📊 총 수집된 데이터:`);
    console.log(`   - 시/도: ${allRegions.cities.length}개`);
    console.log(`   - 시/구/군: ${allRegions.districts.length}개`);
    console.log(`   - 동/읍/면: ${allRegions.neighborhoods.length}개`);

  } catch (error) {
    console.error('❌ 데이터 수집 중 오류 발생:', error);
  }
}

function generateTypeScriptData(allRegions) {
  return `// 자동 생성된 전국 지역 데이터
// 생성일: ${new Date().toISOString()}

export interface Region {
  code: string;
  name: string;
  parentCode: string;
}

export const regionData = {
  cities: ${JSON.stringify(allRegions.cities, null, 2)},
  districts: ${JSON.stringify(allRegions.districts, null, 2)},
  neighborhoods: ${JSON.stringify(allRegions.neighborhoods, null, 2)}
};

// 지역 코드별 동/읍/면 데이터 매핑 함수
export function getNeighborhoodsByParentCode(parentCode: string): Region[] {
  return regionData.neighborhoods.filter(region => region.parentCode === parentCode);
}

// 시/도 코드별 시/구/군 데이터 매핑 함수
export function getDistrictsByParentCode(parentCode: string): Region[] {
  return regionData.districts.filter(region => region.parentCode === parentCode);
}
`;
}

// 스크립트 실행
if (require.main === module) {
  collectAllRegions();
}

module.exports = { collectAllRegions, fetchRegions };
