"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export interface SearchOption {
  value: string
  label: string
}

export interface SingleSearchFormProps {
  // 검색어 관련
  searchTerm: string
  onSearchTermChange: (value: string) => void
  searchPlaceholder?: string
  
  // 셀렉트박스 관련
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categoryOptions: SearchOption[]
  selectPlaceholder?: string
  
  // 검색 실행
  onSearch?: () => void
  
  // 스타일 커스터마이징
  selectWidth?: string
  className?: string
}

export default function SingleSearchForm({
  searchTerm,
  onSearchTermChange,
  searchPlaceholder = "검색어를 입력해주세요.",
  selectedCategory,
  onCategoryChange,
  categoryOptions,
  selectPlaceholder = "항목",
  onSearch,
  selectWidth = "140px",
  className = ""
}: SingleSearchFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch()
    }
  }

  return (
    <section className={`bg-slate-50 rounded-xl border p-3 sm:p-4 ${className}`}>
      <div className="flex gap-2 items-center">
        {/* 셀렉트박스 */}
        <div className="flex-shrink-0 w-[100px] sm:w-[140px]">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="bg-white border-gray-300 shadow-none h-9 text-xs sm:text-sm w-full">
              <SelectValue placeholder={selectPlaceholder} />
            </SelectTrigger>
            <SelectContent className="w-[100px] sm:w-[140px]">
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 검색 필드 */}
        <div className="relative flex-1 min-w-0">
          <Input 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pr-8 sm:pr-10 shadow-none w-full bg-white text-xs sm:text-sm text-gray-700 h-9" 
            onKeyDown={handleKeyDown}
          />
          <Search className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>
    </section>
  )
}
