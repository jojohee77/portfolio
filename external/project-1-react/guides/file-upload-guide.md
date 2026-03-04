# FileUpload 컴포넌트 가이드

## 개요
`FileUpload`는 파일 업로드 기능을 제공하는 재사용 가능한 공통 컴포넌트입니다. 드래그 앤 드롭, 파일 크기 검증, 파일 타입 제한 등의 기능을 제공합니다.

## 주요 기능
- ✅ 파일 선택 및 업로드
- ✅ 드래그 앤 드롭 지원
- ✅ 단일/다중 파일 업로드
- ✅ 파일 타입 제한
- ✅ 파일 크기 제한
- ✅ 업로드된 파일 목록 표시
- ✅ 파일 삭제 기능
- ✅ 비활성화 상태
- ✅ 커스터마이징 가능한 텍스트 및 아이콘

## 설치 및 임포트

```tsx
import { FileUpload } from "@/components/ui/file-upload"
```

## 기본 사용법

### 1. 기본 예제
```tsx
import { FileUpload } from "@/components/ui/file-upload"

export default function MyPage() {
  const handleFileChange = (files: File[]) => {
    console.log("업로드된 파일:", files)
  }

  return (
    <FileUpload 
      onChange={handleFileChange}
    />
  )
}
```

### 2. PDF 파일만 업로드
```tsx
<FileUpload 
  accept=".pdf"
  multiple={false}
  mainText="PDF 파일을 업로드하세요"
  onChange={handleFileChange}
/>
```

### 3. 이미지 파일 업로드
```tsx
<FileUpload 
  accept=".jpg,.jpeg,.png,.gif"
  maxSizeMB={5}
  mainText="이미지를 업로드하세요"
  subText="JPG, PNG, GIF 파일만 업로드 가능합니다 (최대 5MB)"
  onChange={handleFileChange}
/>
```

### 4. 계약서 업로드 (실제 사용 예)
```tsx
<FileUpload 
  accept=".pdf,.doc,.docx"
  multiple={true}
  maxSizeMB={10}
  mainText="계약서 파일을 업로드하세요"
  onChange={(files) => {
    console.log("계약서:", files)
    // 서버로 파일 업로드 처리
  }}
/>
```

### 5. 파일 목록 숨기기
```tsx
<FileUpload 
  showFileList={false}
  onChange={handleFileChange}
/>
```

### 6. 커스텀 아이콘 사용
```tsx
<FileUpload 
  iconSrc="/icons/custom-upload-icon.png"
  onChange={handleFileChange}
/>
```

### 7. 비활성화 상태
```tsx
<FileUpload 
  disabled={true}
  onChange={handleFileChange}
/>
```

### 8. 초기 파일 설정
```tsx
const [initialFiles, setInitialFiles] = useState<File[]>([])

<FileUpload 
  initialFiles={initialFiles}
  onChange={handleFileChange}
/>
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(files: File[]) => void` | `undefined` | 파일 변경 시 호출되는 콜백 함수 |
| `accept` | `string` | `".pdf,.doc,.docx"` | 허용되는 파일 타입 (예: ".pdf,.doc,.docx") |
| `multiple` | `boolean` | `true` | 다중 파일 업로드 허용 여부 |
| `maxSizeMB` | `number` | `10` | 최대 파일 크기 (MB 단위) |
| `mainText` | `string` | `"파일을 업로드하세요"` | 업로드 영역 메인 텍스트 |
| `subText` | `string` | `자동 생성` | 업로드 영역 보조 텍스트 |
| `iconSrc` | `string` | `"/icons/icon-upload.png"` | 업로드 아이콘 경로 |
| `initialFiles` | `File[]` | `[]` | 초기 파일 목록 |
| `showFileList` | `boolean` | `true` | 업로드된 파일 목록 표시 여부 |
| `disabled` | `boolean` | `false` | 비활성화 여부 |
| `className` | `string` | `""` | 추가 클래스명 |

## 고급 사용 예제

### Form과 함께 사용하기
```tsx
import { useState } from "react"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"

export default function ContractForm() {
  const [contractFiles, setContractFiles] = useState<File[]>([])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    contractFiles.forEach((file) => {
      formData.append('contracts', file)
    })
    
    // 서버로 전송
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      console.log("업로드 성공!")
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <FileUpload 
        onChange={setContractFiles}
        mainText="계약서를 업로드하세요"
      />
      <Button type="submit" className="mt-4">
        제출하기
      </Button>
    </form>
  )
}
```

### 파일 유효성 검사
```tsx
const handleFileChange = (files: File[]) => {
  // 추가 유효성 검사
  const validFiles = files.filter(file => {
    if (file.name.includes('test')) {
      alert('테스트 파일은 업로드할 수 없습니다.')
      return false
    }
    return true
  })
  
  setUploadedFiles(validFiles)
}

<FileUpload onChange={handleFileChange} />
```

### 업로드 진행률 표시
```tsx
import { useState } from "react"
import { FileUpload } from "@/components/ui/file-upload"

export default function UploadWithProgress() {
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const handleUpload = async (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100
        setUploadProgress(progress)
      }
    })
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('업로드 완료')
        setUploadProgress(0)
      }
    })
    
    xhr.open('POST', '/api/upload')
    xhr.send(formData)
  }
  
  return (
    <div>
      <FileUpload onChange={handleUpload} />
      {uploadProgress > 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            업로드 중... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
    </div>
  )
}
```

## 스타일 커스터마이징

### 클래스명 추가
```tsx
<FileUpload 
  className="my-custom-class"
  onChange={handleFileChange}
/>
```

### Tailwind CSS로 스타일 오버라이드
```tsx
<div className="max-w-md mx-auto">
  <FileUpload 
    onChange={handleFileChange}
  />
</div>
```

## 파일 타입별 accept 값

| 파일 종류 | accept 값 |
|----------|-----------|
| PDF | `.pdf` |
| Word 문서 | `.doc,.docx` |
| Excel | `.xls,.xlsx` |
| 이미지 | `.jpg,.jpeg,.png,.gif,.webp` |
| 텍스트 | `.txt` |
| 압축 파일 | `.zip,.rar,.7z` |
| 모든 파일 | `*` |

## 주의사항

1. **파일 아이콘**: `/public/icons/icon-upload.png` 파일이 존재해야 합니다.
2. **파일 크기**: `maxSizeMB` 값은 서버의 업로드 제한과 일치해야 합니다.
3. **보안**: 클라이언트 측 검증만으로는 부족하므로 서버에서도 파일 타입과 크기를 반드시 검증하세요.
4. **메모리**: 대용량 파일을 다룰 때는 브라우저 메모리 사용에 주의하세요.

## 실제 프로젝트 사용 예시

### 계약등록 모달에서 사용
```tsx
import { FileUpload } from "@/components/ui/file-upload"

// 계약서 첨부 섹션
<div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
  <Label className="text-sm font-semibold text-gray-500 md:w-20 flex-shrink-0 md:pt-3">
    계약서 <br className="md:block hidden" /> 첨부파일
  </Label>
  <FileUpload 
    accept=".pdf,.doc,.docx"
    multiple={true}
    maxSizeMB={10}
    mainText="계약서 파일을 업로드하세요"
    onChange={(files) => {
      console.log('업로드된 파일:', files)
      // 파일 처리 로직
    }}
  />
</div>
```

## 트러블슈팅

### 문제: 파일 선택 후 같은 파일을 다시 선택할 수 없음
**해결**: input의 value를 초기화하는 로직이 이미 컴포넌트에 포함되어 있습니다.

### 문제: 드래그 앤 드롭이 작동하지 않음
**해결**: 부모 요소에서 drag 이벤트를 preventDefault하고 있는지 확인하세요.

### 문제: 업로드된 파일 목록이 표시되지 않음
**해결**: `showFileList={true}` prop이 설정되어 있는지 확인하세요.

## 브라우저 호환성

- Chrome: ✅
- Firefox: ✅
- Safari: ✅
- Edge: ✅
- IE11: ❌ (미지원)

## 관련 컴포넌트

- `Button` - 파일 삭제 버튼에 사용
- `Input` - 파일 input 요소의 기반

## 변경 이력

- **v1.0.0** (2025-10-10)
  - 초기 버전 생성
  - 드래그 앤 드롭 지원
  - 파일 크기/타입 검증
  - 업로드된 파일 목록 표시

