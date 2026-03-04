# 레이아웃 차이점 상세 분석

## 🔴 1. 인트로(Intro) 섹션

### ❌ 현재 구현
```
- 프로필 이미지: 좌측 (lg:flex-row)
- 텍스트: 우측
- 반응형 레이아웃 (flex)
```

### ✅ 레퍼런스 디자인
```
레이아웃:
- 프로필 이미지: 왼쪽 고정 (left: 265px, top: 1204px)
- 이미지 크기: width: 384px, height: 492px
- 이미지 스타일: rounded-[103px] (매우 둥근 모서리)

텍스트 배치:
- 타이틀 위치: left: 684px, top: 1229px (중앙 상단)
- 타이틀: "브랜드에 색을 더하는"
         "웹디자이너 조성희 입니다."
- 본문 위치: left: calc(50%-36px), top: 1495px (중앙 하단)
- 본문 너비: 483px
```

**주요 차이:**
- 레퍼런스는 절대 위치로 배치 (중앙 정렬)
- 현재는 flexbox로 좌우 배치
- 텍스트 정렬 방식이 완전히 다름

---

## 🟡 2. 프로필(Profile) 섹션

### ❌ 현재 구현
```
- PROFILE 타이틀
- 구분선
- 간단한 정보 (이름, 생년월일, 연락처)
```

### ✅ 레퍼런스 디자인
```
섹션 순서:
1. PROFILE (left: 273px, top: 1834.5px)
2. 구분선 (Line 1, width: 896px, left: 273px, top: 1776px)
3. 프로필 정보 (left: calc(50%-89px), top: 1824px)
   - 조성희  (1994.10.01)
   - T.  010-6480-1979
   - E.  jodesign94@gmail.com

4. EXPERIENCE OVERVIEW (left: 273px, top: 2019px)
5. 구분선 (Line 1, width: 896px, left: 273px, top: 1970px)
6. 경력 목록 (left: 631px, top: 2019px)

7. EDUCATION (left: 273px, top: 2217.5px)
8. 구분선 (Line 1, width: 896px, left: 273px, top: 2157px)
9. 교육 목록 (left: 631px, top: 2207px)
```

**주요 차이:**
- 레퍼런스는 여러 구분선이 있음 (각 섹션마다)
- EXPERIENCE와 EDUCATION이 **분리된 섹션**
- 현재는 하나의 ExperienceSection에 통합
- 구분선 너비와 위치가 정확함 (896px)

---

## 🔴 3. ADDITIONAL WORKS 섹션 (누락!)

### ❌ 현재 구현
```
없음!
```

### ✅ 레퍼런스 디자인
```
위치: top: 4834px (Projects 다음, Contact 이전)

타이틀:
- "ADDITIONAL WORKS" (text-[42px], center)
- 부제목: "Logos · Business Cards" (text-[18px], text-[#b8b8b8])

레이아웃:
- 메이슨리 그리드 (불규칙한 크기의 이미지들)
- 이미지들:
  * Rectangle24, Rectangle30, Rectangle36 (좌측 열)
  * Rectangle23, Rectangle33 (중앙-좌)
  * Rectangle26, Rectangle34 (중앙-우)
  * Rectangle25, Rectangle38 (우측 상단)
  * Rectangle42 (우측 하단, 큰 이미지)

하단 그라데이션:
- 페이드 효과 (top: 5302px)
- from-[rgba(43,43,43,0)] to-[#2b2b2b]
```

**이 섹션이 완전히 누락되어 있습니다!**

---

## 📊 섹션 순서 비교

### 레퍼런스 순서
1. Hero
2. **Intro** (프로필 이미지 + 타이틀 + 설명)
3. **Profile** (개인정보만)
4. **Experience Overview** (경력)
5. **Education** (교육)
6. **Skill** (코딩/디자인)
7. **AI Workflow** (AI 도구)
8. **Projects**
9. **Additional Works** ⚠️ 누락
10. **Contact**

### 현재 구현 순서
1. Hero
2. Intro (비슷하지만 레이아웃 다름)
3. Profile (간단)
4. Experience (경력+교육 통합)
5. Skill (코딩/디자인/AI 통합)
6. Projects
7. Contact (Additional Works 누락!)

---

## 🎯 수정 필요 사항

### High Priority
1. ✅ **Additional Works 섹션 추가**
   - 새로운 컴포넌트 생성
   - 메이슨리 그리드 구현
   - Projects와 Contact 사이에 배치

2. ⚠️ **Experience와 Education 분리**
   - 현재 하나의 섹션
   - 레퍼런스는 별도 섹션
   - 각각 독립된 제목과 구분선

### Medium Priority
3. ⚠️ **Intro 섹션 레이아웃 변경**
   - 프로필 이미지 왼쪽 고정
   - 텍스트 중앙 배치
   - 절대 위치 방식 (선택적)

4. ⚠️ **구분선 스타일 통일**
   - 현재: h-px bg-[#474747]
   - 레퍼런스: 동일하지만 더 많은 구분선
   - width: 896px 고정

### Low Priority
5. ⚠️ **Skill 섹션 분리**
   - 현재: 코딩/디자인/AI 하나로
   - 레퍼런스: Skill과 AI Workflow 분리
   - 각각 독립된 제목

---

## 🚀 권장 사항

### 빠른 수정 (반응형 유지)
- ✅ Additional Works 섹션만 추가
- ✅ 현재 레이아웃 유지
- ✅ 반응형 그대로 유지
- **장점**: 빠르게 완성, 반응형 지원
- **단점**: 레퍼런스와 약간 다름

### 완벽한 재현 (절대 위치)
- ⚠️ 모든 섹션을 절대 위치로 변경
- ⚠️ 정확한 픽셀 위치 사용
- ⚠️ 반응형 제거 (1440px 고정)
- **장점**: 레퍼런스와 동일
- **단점**: 반응형 불가, 유지보수 어려움

**추천: 빠른 수정 방식** (Additional Works만 추가)
