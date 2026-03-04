# 레퍼런스 디자인과 현재 구현의 차이점

## 🔴 Hero 섹션 (메인 상단)

### ❌ 현재 구현
- 단순한 "Portfolio" 텍스트
- 기본 레이아웃
- 데코레이션 없음

### ✅ 레퍼런스 디자인
1. **브라우저 탭 UI**
   - 맥 스타일 3개 버튼 (빨강, 노랑, 초록)
   - 탭 바 (회색 배경, 둥근 모서리)
   - 파비콘 아이콘
   - "성희의 포트폴리오" 탭 제목

2. **Portfolio 3D 텍스트 배치**
   - 각 글자가 개별 이미지로 분리
   - 3D 회전 효과 (rotate-[-11.38deg], rotate-[8.59deg] 등)
   - 이미지 파일 필요:
     * 포폴-p.png
     * 포폴-o.png (첫 번째 O)
     * 포폴-r.png
     * 포폴-t.png
     * 포폴-f.png
     * 포폴-o2.png (두 번째 O)
     * 포폴-l.png
     * 포폴-i.png
     * 포폴-o3.png (세 번째 O)

3. **배경 데코레이션**
   - 포폴-별.png (반짝이는 별)
   - 포폴-데코미러볼.png (미러볼)
   - 데코-은색.png (은색 볼, blur 효과)

4. **2026/Web 배지**
   - 타원형 배지 (교집합 그래픽)
   - 2026: 상단
   - Web: 하단 (녹색 채움)

---

## 🟡 Intro 섹션

### 차이점
- **레퍼런스**: 프로필 이미지가 둥근 모서리 (rounded-[103px])
- **현재**: 기본 구현됨, 이미지만 추가하면 됨

---

## 🟢 Additional Works 섹션

### ❌ 현재 구현
- 없음

### ✅ 레퍼런스 디자인
- "ADDITIONAL WORKS" 섹션
- 부제목: "Logos · Business Cards"
- 메이슨리 그리드 레이아웃
- 로고 및 명함 디자인 이미지들
- 하단 그라데이션 페이드 효과

---

## 📁 필요한 이미지 파일 목록

### Hero 섹션
```
hero/
├── favicon.png                 (파비콘)
├── portfolio-p.png             (P 글자)
├── portfolio-o.png             (첫 번째 O)
├── portfolio-r.png             (R 글자)
├── portfolio-t.png             (T 글자)
├── portfolio-f.png             (F 글자)
├── portfolio-o2.png            (두 번째 O)
├── portfolio-l.png             (L 글자)
├── portfolio-i.png             (I 글자)
├── portfolio-o3.png            (세 번째 O)
├── star.png                    (별 데코)
├── mirror-ball.png             (미러볼)
└── silver-ball.png             (은색 볼)
```

### 프로필
```
profile/
└── profile-photo.png           (프로필 사진)
```

### 프로젝트 썸네일
```
projects/
├── ag-office.png
├── bbagle-ai.png
├── gazet-ai.png
├── hamster-mbti.png
├── hidden-ad.png
├── abridge.png
├── gongja.png
├── yaguin.png
└── treasure.png
```

### 프로젝트 상세 이미지
```
projects/detail/
├── ag-office-1.png
├── ag-office-2.png
├── bbagle-ai-1.png
├── bbagle-ai-2.png
└── ... (각 프로젝트별 상세 이미지)
```

### 스킬 아이콘
```
skills/coding/
├── html.png
├── css.png
├── js.png
└── jquery.png

skills/design/
├── photoshop.png
├── illustrator.png
├── figma.png
├── xd.png
└── zeplin.png

skills/ai/
├── cursor.png
├── figma-make.png
├── v0.png
├── chatgpt.png
├── gemini.png
├── claude.png
└── perplexity.png
```

### Additional Works
```
additional/
├── logo-1.png
├── logo-2.png
├── business-card-1.png
├── business-card-2.png
└── ... (로고 및 명함 디자인들)
```

---

## 🎨 주요 디자인 차이점 요약

| 섹션 | 레퍼런스 | 현재 구현 | 차이점 |
|------|----------|-----------|--------|
| Hero | 3D Portfolio 텍스트 + 브라우저 UI | 단순 텍스트 | ⚠️ 매우 다름 |
| 네비게이션 | 우측 고정, Additional 항목 포함 | 동일 | ✅ 유사 |
| Intro | 둥근 프로필 사진 | 동일 | ✅ 유사 |
| Profile | 동일 | 동일 | ✅ 동일 |
| Experience | 동일 | 동일 | ✅ 동일 |
| Skill | 동일 | 동일 | ✅ 동일 |
| Projects | 그리드 + 그라데이션 | 그리드 | ⚠️ 세부 차이 |
| Additional Works | 있음 (메이슨리) | 없음 | ❌ 누락 |
| Contact | 동일 | 동일 | ✅ 동일 |

---

## ⚡ 우선순위

### High Priority (필수)
1. ✅ Hero 섹션 이미지 파일 추가
2. ⚠️ Portfolio 3D 텍스트 배치 (선택적 - 복잡도 높음)
3. ✅ 프로필 사진 추가
4. ✅ 프로젝트 썸네일 추가
5. ✅ 스킬 아이콘 추가

### Medium Priority (권장)
6. ⚠️ Additional Works 섹션 추가
7. ⚠️ 브라우저 탭 UI 추가
8. ⚠️ 배경 데코레이션 추가

### Low Priority (선택)
9. ⚠️ 프로젝트 상세 이미지 추가
10. ⚠️ 로고/명함 디자인 이미지 추가

---

## 💡 권장 사항

### 간단한 버전 (현재 구현 유지)
- 이미지만 추가하면 바로 사용 가능
- 반응형 지원됨
- 유지보수 쉬움
- **추천**: 빠르게 런칭하고 싶다면

### 완벽한 레퍼런스 재현
- Portfolio 3D 텍스트 배치 구현 필요
- 브라우저 탭 UI 구현 필요
- Additional Works 섹션 추가
- 복잡도 높음, 시간 많이 소요
- **추천**: 완벽한 디자인 재현이 목표라면
