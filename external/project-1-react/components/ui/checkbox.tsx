'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
      <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer relative group bg-gray-300 dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:bg-primary focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 size-5 shrink-0 rounded-[6px] shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:data-[state=checked]:bg-gray-300 disabled:text-white disabled:opacity-100',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none data-[state=unchecked]:hidden data-[state=indeterminate]:hidden"
      >
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
      {/* 체크 해제 상태에서도 체크 아이콘 표시 (indeterminate/checked에서는 숨김) */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white group-data-[state=checked]:hidden group-data-[state=indeterminate]:hidden">
        <CheckIcon className="size-4" />
      </span>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
