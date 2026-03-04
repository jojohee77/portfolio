"use client"

import type React from "react"

interface RegisterFormSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function RegisterFormSection({
  title,
  children,
  className = ""
}: RegisterFormSectionProps) {
  return (
    <div className={`space-y-4 sm:space-y-3 sm:rounded-xl sm:border sm:border-gray-200 sm:p-4 ${className}`}>
      <h4 className="text-lg font-semibold text-slate-900 mb-4 pb-3 border-b border-gray-200 -mx-4 px-4">
        {title}
      </h4>
      {children}
    </div>
  )
}
