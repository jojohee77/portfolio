"use client"

import { useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface RankingHistory {
  date: string
  rank: number
}

type ChartPoint = RankingHistory & { isReworkPoint?: boolean }

interface PostingChartModalProps {
  isOpen: boolean
  onClose: () => void
  keyword: string
  history: RankingHistory[]
  contractThreshold?: number
  reworkStartDate?: string
}

export default function PostingChartModal({
  isOpen,
  onClose,
  keyword,
  history,
  contractThreshold,
  reworkStartDate,
}: PostingChartModalProps) {
  const chartData = useMemo<ChartPoint[]>(() => {
    const sorted: ChartPoint[] = [...history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    if (reworkStartDate && sorted.length > 0) {
      const reworkTime = new Date(reworkStartDate).getTime()
      let targetIndex = sorted.findIndex(
        (item) => new Date(item.date).getTime() >= reworkTime
      )

      if (targetIndex === -1) {
        targetIndex = sorted.length - 1
      }

      if (targetIndex >= 0) {
        sorted[targetIndex] = {
          ...sorted[targetIndex],
          isReworkPoint: true,
        }
      }
    }

    return sorted
  }, [history, reworkStartDate])

  const renderDot = (radius: number, reworkRadius: number) => (props: {
    cx?: number
    cy?: number
    payload?: { isReworkPoint?: boolean }
  }) => {
    const cx = props?.cx ?? 0
    const cy = props?.cy ?? 0
    const isReworkPoint = props?.payload?.isReworkPoint

    const fill = isReworkPoint ? "#7C3AED" : "var(--primary)"
    const r = isReworkPoint ? reworkRadius : radius

    return <circle cx={cx} cy={cy} r={r} fill={fill} />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[800px] lg:max-w-[800px] xl:max-w-[800px] max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold m-0">키워드 순위 추이</DialogTitle>
              <p className="text-sm text-slate-600 mt-1">{keyword}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
          <div className="flex flex-col gap-3 h-[400px]">
            {chartData.some((point) => point.isReworkPoint) && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
                  재작업 시작
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
                  일반 순위
                </span>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#64748B"
                  tick={{ fontSize: 12 }}
                  reversed
                  domain={[1, 20]}
                  label={{ value: "순위", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number, _name, entry) => {
                    const payload: any = Array.isArray(entry) ? entry[0] : entry
                    const suffix = payload?.payload?.isReworkPoint ? " (재작업 시작)" : ""
                    return [`${value}위${suffix}`, "순위"]
                  }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                  }}
                />
                {typeof contractThreshold === "number" && (
                  <ReferenceLine
                    y={contractThreshold}
                    stroke="#EF4444"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    label={{
                      position: "right",
                      value: `재작업 기준 ${contractThreshold}위`,
                      fill: "#EF4444",
                      fontSize: 12,
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="rank"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={renderDot(4, 6)}
                  activeDot={renderDot(6, 8)}
                  name="순위"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0 bg-white">
          <Button
            variant="outline"
            onClick={onClose}
            className="shadow-none rounded-lg border-gray-200"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
