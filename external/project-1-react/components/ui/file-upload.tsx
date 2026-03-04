"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "./button"

export interface FileUploadProps {
  /**
   * 업로드된 파일 변경 시 호출되는 콜백 함수
   */
  onChange?: (files: File[]) => void
  
  /**
   * 허용되는 파일 타입 (예: ".pdf,.doc,.docx")
   */
  accept?: string
  
  /**
   * 다중 파일 업로드 허용 여부
   */
  multiple?: boolean
  
  /**
   * 최대 파일 크기 (MB 단위, 기본값: 10MB)
   */
  maxSizeMB?: number
  
  /**
   * 업로드 영역 메인 텍스트
   */
  mainText?: string
  
  /**
   * 업로드 영역 보조 텍스트
   */
  subText?: string
  
  /**
   * 업로드 아이콘 경로
   */
  iconSrc?: string
  
  /**
   * 초기 파일 목록
   */
  initialFiles?: File[]
  
  /**
   * 업로드된 파일 목록 표시 여부
   */
  showFileList?: boolean
  
  /**
   * 비활성화 여부
   */
  disabled?: boolean
  
  /**
   * 추가 클래스명
   */
  className?: string
}

interface UploadedFile {
  file: File
  id: string
}

export function FileUpload({
  onChange,
  accept = ".pdf,.doc,.docx",
  multiple = true,
  maxSizeMB = 10,
  mainText = "파일을 업로드하세요",
  subText,
  iconSrc = "/icons/icon-upload.png",
  initialFiles = [],
  showFileList = true,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    initialFiles.map(file => ({ file, id: Math.random().toString(36).substr(2, 9) }))
  )
  const [dragActive, setDragActive] = useState(false)

  // 기본 보조 텍스트 생성
  const defaultSubText = React.useMemo(() => {
    const acceptTypes = accept.split(',').map(type => type.trim().toUpperCase().replace('.', '')).join(', ')
    return `${acceptTypes} 파일만 업로드 가능합니다 (최대 ${maxSizeMB}MB)`
  }, [accept, maxSizeMB])

  const handleFileSelect = (files: FileList | null) => {
    if (!files || disabled) return

    const newFiles: UploadedFile[] = []
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    Array.from(files).forEach(file => {
      // 파일 크기 체크
      if (file.size > maxSizeBytes) {
        alert(`${file.name} 파일이 너무 큽니다. 최대 ${maxSizeMB}MB까지 업로드 가능합니다.`)
        return
      }

      // 파일 타입 체크
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      const allowedTypes = accept.split(',').map(type => type.trim().toLowerCase())
      
      if (!allowedTypes.includes(fileExtension)) {
        alert(`${file.name}은(는) 허용되지 않는 파일 형식입니다.`)
        return
      }

      newFiles.push({
        file,
        id: Math.random().toString(36).substr(2, 9)
      })
    })

    const updatedFiles = multiple ? [...uploadedFiles, ...newFiles] : newFiles
    setUploadedFiles(updatedFiles)

    if (onChange) {
      onChange(updatedFiles.map(f => f.file))
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files)
    // input 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== id)
    setUploadedFiles(updatedFiles)

    if (onChange) {
      onChange(updatedFiles.map(f => f.file))
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (!disabled && e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const shortenFileName = (fileName: string, maxLength: number = 30) => {
    if (fileName.length <= maxLength) return fileName
    
    const extension = fileName.substring(fileName.lastIndexOf('.'))
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'))
    const maxNameLength = maxLength - extension.length - 3 // 3 for '...'
    
    if (maxNameLength < 1) return fileName.substring(0, maxLength)
    
    return nameWithoutExt.substring(0, maxNameLength) + '...' + extension
  }

  return (
    <div className={`w-full ${className}`}>
      {/* 업로드 영역 */}
      <div 
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
          disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
            : dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer'
        }`}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 relative">
            <Image
              src={iconSrc}
              alt="파일 업로드"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{mainText}</p>
            <p className="text-xs text-gray-500">{subText || defaultSubText}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple={multiple}
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
          />
        </div>
      </div>

      {/* 업로드된 파일 목록 */}
      {showFileList && uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto">
          {uploadedFiles.map(({ file, id }) => (
            <div 
              key={id} 
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm text-gray-900 font-medium" title={file.name}>{shortenFileName(file.name)}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} · {formatDate(new Date(file.lastModified))}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile(id)
                }}
                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

