"use client"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export interface SearchFormProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch?: () => void
  className?: string
  disabled?: boolean
}

export const SearchForm = forwardRef<HTMLInputElement, SearchFormProps>(
  ({ placeholder = "검색하세요", value, onChange, onSearch, className = "", disabled = false }, ref) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch()
      }
    }

    return (
      <div className={`relative w-full ${className}`}>
        <Input
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pr-10 shadow-none bg-white focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          type="button"
          onClick={onSearch}
          disabled={disabled}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    )
  }
)

SearchForm.displayName = "SearchForm"
