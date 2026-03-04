"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X } from "lucide-react"

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
}

interface PostingData {
  workTaskId: string
  keyword: string
  assignee: string
  period: string
  postingCount: number
  reworkCount: number
  validCount: number
}

interface WorkStatusDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: WorkTask | null
  postingData: PostingData[]
}

const WorkStatusDetailModal: React.FC<WorkStatusDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  postingData,
}) => {
  if (!isOpen || !task) return null

  const taskPostings = postingData.filter((p) => p.workTaskId === task.id)
  const totalPostings = taskPostings.reduce((sum, p) => sum + p.postingCount, 0)
  const totalRework = taskPostings.reduce((sum, p) => sum + p.reworkCount, 0)
  const totalValid = taskPostings.reduce((sum, p) => sum + p.validCount, 0)

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">포스팅 현황 상세</h3>
              <p className="text-sm text-slate-600 mt-1">
                {task.contractNumber} - {task.serviceType}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* 요약 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-800">총 포스팅 개수</p>
                    <p className="text-2xl font-bold text-blue-900">{totalPostings}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-red-800">재작업 키워드 개수</p>
                    <p className="text-2xl font-bold text-red-900">{totalRework}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-800">유효작업 개수</p>
                    <p className="text-2xl font-bold text-green-900">{totalValid}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 키워드별 상세 정보 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">키워드별 상세 현황</h4>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>키워드명</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>기간</TableHead>
                      <TableHead className="text-center">포스팅 개수</TableHead>
                      <TableHead className="text-center">재작업 키워드 개수</TableHead>
                      <TableHead className="text-center">유효작업 개수</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskPostings.map((posting, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-50">
                            {posting.keyword}
                          </Badge>
                        </TableCell>
                        <TableCell>{posting.assignee}</TableCell>
                        <TableCell className="text-sm">{posting.period}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-blue-100 text-blue-800">{posting.postingCount}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-red-100 text-red-800">{posting.reworkCount}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-800">{posting.validCount}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {taskPostings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">등록된 포스팅 데이터가 없습니다.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkStatusDetailModal
