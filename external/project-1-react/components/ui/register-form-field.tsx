"use client"

import type React from "react"
import { Label } from "@/components/ui/label"

interface RegisterFormFieldProps {
  label: string | React.ReactNode
  required?: boolean
  children: React.ReactNode
  error?: string
  className?: string
  labelClassName?: string
}

export default function RegisterFormField({
  label,
  required = false,
  children,
  error,
  className = "",
  labelClassName = "md:w-32 shrink-0 text-sm text-gray-600"
}: RegisterFormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 md:flex-row md:items-center md:gap-4 ${className}`}>
      <Label className={labelClassName}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex-1">
        {children}
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  )
}

// 특별한 레이아웃을 위한 변형 컴포넌트들
export function RegisterFormFieldStart({
  label,
  required = false,
  children,
  error,
  className = "",
  labelClassName = "md:w-32 md:pt-2 shrink-0 text-sm text-gray-600"
}: RegisterFormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 md:flex-row md:items-start md:gap-4 ${className}`}>
      <Label className={labelClassName}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex-1">
        {children}
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  )
}

export function RegisterFormFieldCenter({
  label,
  required = false,
  children,
  error,
  className = "",
  labelClassName = "md:w-32 shrink-0 text-sm text-gray-600"
}: RegisterFormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 md:flex-row md:items-center md:gap-4 ${className}`}>
      <Label className={labelClassName}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex-1">
        {children}
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  )
}
