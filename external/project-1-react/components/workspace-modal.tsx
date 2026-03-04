"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export interface WorkspaceModalSubmitPayload {
  name: string
  inviteEmails: string[]
}

interface WorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (payload: WorkspaceModalSubmitPayload) => Promise<void> | void
  title?: string
  submitButtonLabel?: string
  cancelButtonLabel?: string
  initialName?: string
  initialInviteEmails?: string[]
  description?: string
  isSubmitting?: boolean
  showNameField?: boolean
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function WorkspaceModal({
  open,
  onOpenChange,
  onSubmit,
  title = "새 워크스페이스",
  submitButtonLabel = "생성",
  cancelButtonLabel = "취소",
  initialName = "",
  initialInviteEmails,
  description,
  isSubmitting: externalSubmitting = false,
  showNameField = true,
}: WorkspaceModalProps) {
  const normalizedInitialInviteEmails = useMemo(() => initialInviteEmails ?? [], [initialInviteEmails])
  const [workspaceName, setWorkspaceName] = useState(initialName)
  const [inviteInput, setInviteInput] = useState("")
  const [inviteEmails, setInviteEmails] = useState<string[]>(normalizedInitialInviteEmails)
  const [internalSubmitting, setInternalSubmitting] = useState(false)

  const isSubmitting = useMemo(() => externalSubmitting || internalSubmitting, [externalSubmitting, internalSubmitting])
  const isNameRequired = showNameField
  const isInviteRequired = !showNameField

  useEffect(() => {
    if (open) {
      setWorkspaceName(initialName)
      setInviteEmails(normalizedInitialInviteEmails)
      setInviteInput("")
    }
  }, [open, initialName, normalizedInitialInviteEmails])

  const resetForm = () => {
    setWorkspaceName(initialName)
    setInviteEmails(normalizedInitialInviteEmails)
    setInviteInput("")
    setInternalSubmitting(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      resetForm()
    }
  }

  const tryAddEmails = (value: string) => {
    const segments = value
      .split(",")
      .map((segment) => segment.trim())
      .filter(Boolean)

    if (segments.length === 0) return

    setInviteEmails((prev) => {
      const next = [...prev]
      segments.forEach((email) => {
        if (emailRegex.test(email) && !next.includes(email)) {
          next.push(email)
        }
      })
      return next
    })
    setInviteInput("")
  }

  const handleSubmit = async () => {
    if ((isNameRequired && !workspaceName.trim()) || (isInviteRequired && inviteEmails.length === 0) || isSubmitting) return

    const payload: WorkspaceModalSubmitPayload = {
      name: workspaceName.trim(),
      inviteEmails,
    }

    if (!onSubmit) {
      handleOpenChange(false)
      return
    }

    setInternalSubmitting(true)
    try {
      await onSubmit(payload)
      handleOpenChange(false)
    } catch (error) {
      console.error("[WorkspaceModal] onSubmit 실패:", error)
    } finally {
      setInternalSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {showNameField && (
            <div className="space-y-2">
              <label htmlFor="workspace-name" className="text-sm font-medium">
                워크스페이스 이름 <span className="text-red-500">*</span>
              </label>
              <Input
                id="workspace-name"
                type="text"
                placeholder="워크스페이스 이름을 입력하세요"
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                className="w-full placeholder:text-xs md:placeholder:text-sm"
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="invite-emails" className="text-sm font-medium">
              초대받을 사람{" "}
              {isInviteRequired ? (
                <span className="text-red-500">*</span>
              ) : (
                <span className="text-gray-400">(선택)</span>
              )}
            </label>
            <div
              className="flex flex-wrap items-center gap-2 min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-all"
              onClick={() => {
                const input = document.getElementById("invite-emails") as HTMLInputElement | null
                input?.focus()
              }}
            >
              {inviteEmails.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  <span className="text-xs">{email}</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setInviteEmails((prev) => prev.filter((item) => item !== email))
                    }}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                    disabled={isSubmitting}
                    aria-label={`${email} 삭제`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                id="invite-emails"
                type="text"
                placeholder={inviteEmails.length === 0 ? "이메일을 입력하세요 (콤마로 구분 가능)" : ""}
                value={inviteInput}
                onChange={(event) => {
                  const { value } = event.target
                  setInviteInput(value)
                  if (value.includes(",")) {
                    tryAddEmails(value)
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    tryAddEmails(inviteInput)
                  } else if (event.key === "Backspace" && inviteInput === "" && inviteEmails.length > 0) {
                    setInviteEmails((prev) => prev.slice(0, -1))
                  }
                }}
                className="flex-1 min-w-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto placeholder:text-xs md:placeholder:text-sm"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              이메일을 입력하고 엔터를 누르거나 콤마(,)로 구분하여 여러 이메일을 한 번에 입력할 수 있습니다
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3">
          <Button
            onClick={() => handleOpenChange(false)}
            className="w-24 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
            disabled={isSubmitting}
          >
            {cancelButtonLabel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={(isNameRequired && !workspaceName.trim()) || (isInviteRequired && inviteEmails.length === 0) || isSubmitting}
            className="w-24 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg"
          >
            {submitButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WorkspaceModal

