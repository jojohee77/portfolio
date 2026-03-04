"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Clock, User, AlertCircle, Edit, X, Target } from "lucide-react"

interface KeywordAssignment {
  id: string
  keyword: string
  teamName: string
  assignee: string
  rankLimit: number
}

interface WorkTask {
  id: string
  contractNumber: string
  serviceType: string
  contractDescription: string
  startDate: string
  endDate: string
  teamName: string
  assignee: string
  targetKeywords: string
  keywordRankLimit: number
  status: "진행중" | "완료" | "대기" | "보류"
  notes: string
  createdAt: string
  keywordAssignments?: KeywordAssignment[]
}

interface WorkDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  task: WorkTask | null
}

const WorkDetailModal: React.FC<WorkDetailModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  task,
}) => {
  if (!isOpen || !task) return null

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      진행중: {
        variant: "default" as const,
        icon: Clock,
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer",
      },
      완료: {
        variant: "default" as const,
        icon: AlertCircle,
        color: "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer",
      },
      대기: {
        variant: "secondary" as const,
        icon: AlertCircle,
        color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer",
      },
      보류: {
        variant: "destructive" as const,
        icon: AlertCircle,
        color: "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">업무 상세 정보</h3>
              <p className="text-sm text-slate-600 mt-1">업무 ID: {task.id}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* 기본 정보 섹션 */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                기본 정보
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">계약번호</Label>
                  <p className="mt-1 text-sm text-slate-900 font-mono bg-white px-3 py-2 rounded border">
                    {task.contractNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">서비스 유형</Label>
                  <p className="mt-1 text-sm text-slate-900 bg-white px-3 py-2 rounded border">
                    {task.serviceType}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-sm font-medium text-slate-600">계약 설명</Label>
                <p className="mt-1 text-sm text-slate-900 bg-white px-3 py-2 rounded border">
                  {task.contractDescription}
                </p>
              </div>
            </div>

            {/* 일정 정보 섹션 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                일정 정보
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">시작일</Label>
                  <p className="mt-1 text-sm text-slate-900 bg-white px-3 py-2 rounded border">
                    {task.startDate}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">종료일</Label>
                  <p className="mt-1 text-sm text-slate-900 bg-white px-3 py-2 rounded border">
                    {task.endDate}
                  </p>
                </div>
              </div>
            </div>

            {/* 담당자 정보 섹션 */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                담당자 정보
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">팀명</Label>
                  <p className="mt-1 text-sm text-slate-900 bg-white px-3 py-2 rounded border">
                    {task.teamName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">담당자</Label>
                  <p className="mt-1 text-sm text-slate-900 bg-white px-3 py-2 rounded border">
                    {task.assignee}
                  </p>
                </div>
              </div>
            </div>

            {/* 키워드 배정 정보 섹션 */}
            {task.keywordAssignments && task.keywordAssignments.length > 0 ? (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  키워드 배정 ({task.keywordAssignments.length}개)
                </h4>
                <div className="bg-white rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">번호</TableHead>
                        <TableHead>키워드</TableHead>
                        <TableHead>팀명</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead className="w-32">재작업순위</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {task.keywordAssignments.map((ka, index) => (
                        <TableRow key={ka.id}>
                          <TableCell className="text-center text-sm text-gray-500">{index + 1}</TableCell>
                          <TableCell className="font-medium">{ka.keyword}</TableCell>
                          <TableCell className="text-sm">{ka.teamName}</TableCell>
                          <TableCell className="text-sm">{ka.assignee}</TableCell>
                          <TableCell className="text-sm text-center">{ka.rankLimit}위</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-3">
                  <Label className="text-sm font-medium text-slate-600">현재 상태</Label>
                  <div className="mt-1">{getStatusBadge(task.status)}</div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  키워드 및 상태
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">목표 키워드</Label>
                    <p className="mt-1 text-sm text-slate-900 bg-white px-3 py-2 rounded border">
                      {task.targetKeywords}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      재작업 필요한 노출 순위: {task.keywordRankLimit}위
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">현재 상태</Label>
                    <div className="mt-1">{getStatusBadge(task.status)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 추가 정보 섹션 */}
            {task.notes && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  비고
                </h4>
                <p className="text-sm text-slate-900 bg-white px-3 py-2 rounded border">{task.notes}</p>
              </div>
            )}

            {/* 등록 정보 */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>등록일: {task.createdAt}</span>
                <span>업무 ID: {task.id}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <Button
              onClick={() => {
                onClose()
                onEdit()
              }}
              className="bg-primary text-primary-foreground shadow-none rounded-lg"
            >
              <Edit className="w-4 h-4 mr-2" />
              수정
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkDetailModal
