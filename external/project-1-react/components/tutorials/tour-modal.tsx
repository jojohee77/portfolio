'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type ImageVariant = 'card' | 'wide'

interface SlideCta {
  label: string
  href: string
}

export interface TourSlide {
  title: string
  mobileTitle?: string
  description: string
  imageSrc?: string
  imageAlt?: string
  imageVariant?: ImageVariant
  imageWidth?: number
  imageHeight?: number
  cta?: SlideCta
}

interface TourModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slides: TourSlide[]
  headline?: string
  trigger?: ReactNode
  firstActionLabel?: string
  nextActionLabel?: string
  finishActionLabel?: string
  skipLabel?: string
}

export function TourModal({
  open,
  onOpenChange,
  slides,
  headline = 'Ag Office 둘러보기',
  trigger,
  firstActionLabel = '둘러보기',
  nextActionLabel = '다음',
  finishActionLabel = '완료',
  skipLabel = '건너뛰기',
}: TourModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const totalSlides = slides.length

  const currentSlide = useMemo<TourSlide | undefined>(
    () => slides[currentStep],
    [currentStep, slides],
  )

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSlides - 1

  const primaryLabel = isFirstStep
    ? firstActionLabel
    : isLastStep
      ? finishActionLabel
      : nextActionLabel

  const handlePrimaryAction = () => {
    if (isLastStep) {
      onOpenChange(false)
      return
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSlides - 1))
  }

  const handleSkip = () => {
    onOpenChange(false)
  }

  useEffect(() => {
    if (!open) {
      setCurrentStep(0)
    }
  }, [open])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCurrentStep(0)
    }
    onOpenChange(nextOpen)
  }

  if (totalSlides === 0) {
    return null
  }

  const ctaButton = currentSlide?.cta ? (
    <Button
      asChild
      variant="outline"
      className="h-10 px-6 rounded-lg sm:rounded-xl border-primary/40 text-primary bg-[var(--bg-light-blue)] hover:bg-[color-mix(in_oklab,var(--primary),white_85%)] shadow-none focus-visible:shadow-none"
    >
      <Link href={currentSlide.cta.href}>{currentSlide.cta.label}</Link>
    </Button>
  ) : null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent className="w-full max-w-[calc(100vw-1rem)] lg:max-w-[860px] bg-gradient-to-b from-slate-50 to-white px-5 sm:px-8 lg:px-12 py-8 sm:py-10 flex flex-col gap-6 sm:gap-9">
        <DialogHeader className="text-center space-y-2">
          <p className="text-sm font-medium text-primary">{headline}</p>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {currentSlide ? (
              <>
                <span className="sm:hidden whitespace-pre-line">
                  {currentSlide.mobileTitle ?? currentSlide.title}
                </span>
                <span className="hidden sm:inline">
                  {currentSlide.title}
                </span>
              </>
            ) : null}
          </DialogTitle>
          {currentSlide?.description ? (
            <p className="text-sm text-muted-foreground">{currentSlide.description}</p>
          ) : null}
        </DialogHeader>

        {currentSlide?.imageSrc ? (
          <div className="flex justify-center">
            {currentSlide.imageVariant === 'card' ? (
              <div className="flex w-full max-w-[540px] flex-col items-center gap-4">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <Image
                    src={currentSlide.imageSrc}
                    alt={currentSlide.imageAlt ?? currentSlide.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 540px, 100vw"
                    priority
                  />
                </div>
                {ctaButton}
              </div>
            ) : (
              <div className="flex w-full max-w-[880px] flex-col items-center gap-6">
                <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <Image
                    src={currentSlide.imageSrc}
                    alt={currentSlide.imageAlt ?? currentSlide.title}
                    width={currentSlide.imageWidth ?? 880}
                    height={currentSlide.imageHeight ?? 480}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                {ctaButton}
              </div>
            )}
          </div>
        ) : ctaButton ? (
          <div className="flex justify-center">{ctaButton}</div>
        ) : null}

        <DialogFooter className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <span>
              {currentStep + 1}/{totalSlides} 단계
            </span>
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`${index + 1}번째 튜토리얼로 이동`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm self-end sm:self-auto">
            <button
              type="button"
              onClick={handleSkip}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {skipLabel}
            </button>
            <Button
              size="sm"
              className="h-10 sm:h-[46px] px-6 rounded-lg sm:rounded-xl bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/60"
              onClick={handlePrimaryAction}
            >
              {primaryLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

