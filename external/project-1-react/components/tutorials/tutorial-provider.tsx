"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

const OVERLAY_Z_INDEX = 120
const DEFAULT_PADDING = 8
const DEFAULT_RADIUS = 12

export type TutorialPlacement = "top" | "bottom" | "left" | "right"

export type TutorialStep = {
  target: string
  content: string
  placement?: TutorialPlacement
  spotlightPadding?: number
  borderRadius?: number
}

export type StartJoyrideOptions = {
  steps: TutorialStep[]
  onClose?: () => void
}

type HighlightRect = {
  top: number
  left: number
  width: number
  height: number
  radius: number
}

type TutorialState = {
  active: boolean
  steps: TutorialStep[]
  currentIndex: number
  rect: HighlightRect | null
  overlayKey: number
}

type TutorialContextValue = {
  startJoyride: (options: StartJoyrideOptions) => void
  stopJoyride: () => void
  isJoyrideRunning: boolean
}

const TutorialContext = createContext<TutorialContextValue | null>(null)

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TutorialState>({
    active: false,
    steps: [],
    currentIndex: 0,
    rect: null,
    overlayKey: 0,
  })
  const onCloseRef = useRef<(() => void) | null>(null)
  const previousOverflowRef = useRef<{ body: string; html: string } | null>(null)

  const stopJoyride = useCallback(() => {
    setState(prev => ({ ...prev, active: false, steps: [], rect: null }))
    onCloseRef.current?.()
  }, [])

  const updateRect = useCallback(
    (steps: TutorialStep[], index: number, attempts = 0) => {
      const step = steps[index]
      if (!step) {
        setState(prev => ({ ...prev, rect: null }))
        return
      }

      const element = typeof document !== "undefined" ? (document.querySelector(step.target) as HTMLElement | null) : null

      if (!element) {
        if (attempts < 10) {
          requestAnimationFrame(() => updateRect(steps, index, attempts + 1))
        } else {
          setState(prev => ({ ...prev, rect: null }))
        }
        return
      }

      const rect = element.getBoundingClientRect()
      const padding = step.spotlightPadding ?? DEFAULT_PADDING
      const highlightRect: HighlightRect = {
        top: Math.max(0, rect.top - padding),
        left: Math.max(0, rect.left - padding),
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        radius: step.borderRadius ?? DEFAULT_RADIUS,
      }

      setState(prev => ({ ...prev, rect: highlightRect }))
    },
    []
  )

  const startJoyride = useCallback(
    ({ steps, onClose }: StartJoyrideOptions) => {
      if (!steps || steps.length === 0) return

      onCloseRef.current = onClose ?? null
      setState({
        active: true,
        steps,
        currentIndex: 0,
        rect: null,
        overlayKey: Date.now(),
      })
      requestAnimationFrame(() => updateRect(steps, 0))
    },
    [updateRect]
  )

  useLayoutEffect(() => {
    if (!state.active) return
    updateRect(state.steps, state.currentIndex)
  }, [state.active, state.currentIndex, state.steps, updateRect])

  useEffect(() => {
    if (!state.active) return

    const handle = () => updateRect(state.steps, state.currentIndex)
    window.addEventListener("resize", handle)
    window.addEventListener("scroll", handle, true)
    return () => {
      window.removeEventListener("resize", handle)
      window.removeEventListener("scroll", handle, true)
    }
  }, [state.active, state.steps, state.currentIndex, updateRect])

  useEffect(() => {
    if (typeof document === "undefined") return

    const body = document.body
    const html = document.documentElement

    if (!body || !html) return

    if (state.active) {
      if (!previousOverflowRef.current) {
        previousOverflowRef.current = {
          body: body.style.overflow,
          html: html.style.overflow,
        }
      }
      body.style.overflow = "hidden"
      html.style.overflow = "hidden"
    } else if (previousOverflowRef.current) {
      body.style.overflow = previousOverflowRef.current.body
      html.style.overflow = previousOverflowRef.current.html
      previousOverflowRef.current = null
    }

    return () => {
      if (previousOverflowRef.current && typeof document !== "undefined") {
        body.style.overflow = previousOverflowRef.current.body
        html.style.overflow = previousOverflowRef.current.html
        previousOverflowRef.current = null
      }
    }
  }, [state.active])

  const value = useMemo<TutorialContextValue>(() => ({
    startJoyride,
    stopJoyride,
    isJoyrideRunning: state.active,
  }), [startJoyride, stopJoyride, state.active])

  const currentStep = state.steps[state.currentIndex]

  return (
    <TutorialContext.Provider value={value}>
      {children}
      {state.active && state.rect && currentStep && (
        <TutorialOverlay
          key={state.overlayKey}
          rect={state.rect}
          step={currentStep}
          index={state.currentIndex}
          size={state.steps.length}
          onNext={() => {
            setState(prev => {
              const nextIndex = prev.currentIndex + 1
              if (nextIndex >= prev.steps.length) {
                onCloseRef.current?.()
                return { ...prev, active: false, rect: null, steps: [] }
              }
              requestAnimationFrame(() => updateRect(prev.steps, nextIndex))
              return { ...prev, currentIndex: nextIndex }
            })
          }}
          onClose={stopJoyride}
        />
      )}
    </TutorialContext.Provider>
  )
}

function TutorialOverlay({
  rect,
  step,
  index,
  size,
  onNext,
  onClose,
}: {
  rect: HighlightRect
  step: TutorialStep
  index: number
  size: number
  onNext: () => void
  onClose: () => void
}) {
  if (typeof document === "undefined") {
    return null
  }

  const placement: TutorialPlacement = step.placement ?? "right"
  const showNext = size > 1 && index < size - 1
  const closeLabel = size <= 1 ? "알겠습니다" : "닫기"
  const showProgress = size > 1

  const tooltipStyle = getTooltipStyle(rect, placement)
  const maskId = `tutorial-mask-${rect.left}-${rect.top}`

  return createPortal(
    <div className="fixed inset-0 z-[120] pointer-events-auto">
      <svg
        className="fixed inset-0 pointer-events-none w-screen h-screen"
        width="100%"
        height="100%"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={rect.left}
              y={rect.top}
              width={rect.width}
              height={rect.height}
              rx={rect.radius}
              ry={rect.radius}
              fill="black"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask={`url(#${maskId})`} />
      </svg>

      <div
        className="fixed pointer-events-none border border-white/30 shadow-[0_0_0_1px_rgba(255,255,255,0.35)] transition-all duration-200"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: rect.radius,
        }}
      />

      <div
        className={cn(
          "fixed pointer-events-auto max-w-xs rounded-xl bg-neutral-900/90 text-white shadow-xl",
          "p-4 flex flex-col gap-3 border border-white/10"
        )}
        style={tooltipStyle}
      >
        <p className="text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line">
          {step.content}
        </p>
        <div className="flex items-center justify-between text-xs font-semibold text-white/80">
          <span>{showProgress ? `${index + 1}/${size}` : ""}</span>
          <div className="flex items-center gap-3">
            {showNext && (
              <button
                type="button"
                onClick={onNext}
                className="cursor-pointer rounded-full bg-[var(--primary)] text-white px-4 py-1.5 text-sm font-bold hover:bg-[color-mix(in_oklab,var(--primary),white_20%)] transition-colors shadow-sm"
              >
                다음
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full bg-white/20 text-white px-4 py-1.5 text-sm font-bold border border-white/30 hover:bg-white/30 transition-colors shadow-sm"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function getTooltipStyle(rect: HighlightRect, placement: TutorialPlacement) {
  if (typeof window === "undefined") {
    return {}
  }

  const margin = 16
  const maxWidth = 320
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let top = rect.top
  let left = rect.left
  let transform = ""

  switch (placement) {
    case "top": {
      top = rect.top - margin
      left = rect.left + rect.width / 2 - maxWidth / 2
      break
    }
    case "bottom": {
      top = rect.top + rect.height + margin
      left = rect.left + rect.width / 2 - maxWidth / 2
      break
    }
    case "left": {
      top = rect.top + rect.height / 2
      left = rect.left - maxWidth - margin
      transform = "translate(0, -50%)"
      break
    }
    case "right":
    default: {
      top = rect.top + rect.height / 2
      left = rect.left + rect.width + margin
      transform = "translate(0, -50%)"
      break
    }
  }

  const minLeft = 16
  const maxLeft = viewportWidth - maxWidth - 16
  left = Math.min(Math.max(minLeft, left), Math.max(minLeft, maxLeft))

  if (placement === "top" || placement === "bottom") {
    transform = ""
  }

  const minTop = 16
  const maxTop = viewportHeight - 16
  top = Math.min(Math.max(minTop, top), maxTop)

  return {
    top,
    left,
    transform,
    position: "fixed" as const,
    maxWidth,
    zIndex: OVERLAY_Z_INDEX + 1,
  }
}

export function useTutorials() {
  const context = useContext(TutorialContext)
  if (!context) {
    throw new Error("useTutorials 훅은 TutorialProvider 내부에서만 사용할 수 있습니다.")
  }

  return context
}

