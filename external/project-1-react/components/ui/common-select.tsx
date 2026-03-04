import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
}

export interface CommonSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  triggerClassName?: string
  contentClassName?: string
  disabled?: boolean
}

/**
 * 공통 셀렉트박스 컴포넌트
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "2024", label: "2024년" },
 *   { value: "2025", label: "2025년" }
 * ]
 *
 * <CommonSelect
 *   value={selectedYear}
 *   onValueChange={setSelectedYear}
 *   options={options}
 *   placeholder="연도 선택"
 * />
 * ```
 */
export function CommonSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
}: CommonSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "w-28 h-8 text-xs bg-white",
          triggerClassName,
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// 레이블과 함께 사용하는 컴포넌트
export interface LabeledSelectProps extends CommonSelectProps {
  label: string
  labelClassName?: string
  wrapperClassName?: string
}

/**
 * 레이블이 포함된 공통 셀렉트박스 컴포넌트
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "2024", label: "2024년" },
 *   { value: "2025", label: "2025년" }
 * ]
 *
 * <LabeledSelect
 *   label="연도:"
 *   value={selectedYear}
 *   onValueChange={setSelectedYear}
 *   options={options}
 * />
 * ```
 */
export function LabeledSelect({
  label,
  labelClassName,
  wrapperClassName,
  ...selectProps
}: LabeledSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", wrapperClassName)}>
      <label className={cn("text-xs sm:text-sm font-medium text-slate-700", labelClassName)}>
        {label}
      </label>
      <CommonSelect {...selectProps} />
    </div>
  )
}
