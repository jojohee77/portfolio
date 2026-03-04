'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { Check, X, TriangleAlert, Info as InfoCircle } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  const getIcon = (variant?: string) => {
    switch (variant) {
      case 'success':
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 flex-shrink-0">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EF4444] flex-shrink-0">
            <X className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
        )
      case 'warning':
        return (
          <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L21 19H3L12 3Z" fill="#FACC15"/>
              <path d="M12 8V13" stroke="#000000" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#000000"/>
            </svg>
          </div>
        )
      case 'info':
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#3B82F6] flex-shrink-0">
            <span className="text-white text-xs font-bold">i</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 flex-shrink-0">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
        )
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center gap-2.5 w-full">
              {getIcon(variant)}
              <div className="flex flex-col">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
