"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw } from "lucide-react"

interface KeywordsFilterBarProps {
  selectedCompetition: string
  onCompetitionChange: (value: string) => void
  selectedClient: string
  onClientChange: (value: string) => void
  competitionLevels: string[]
  clients: string[]
}

export function KeywordsFilterBar({
  selectedCompetition,
  onCompetitionChange,
  selectedClient,
  onClientChange,
  competitionLevels,
  clients,
}: KeywordsFilterBarProps) {
  const handleReset = () => {
    onCompetitionChange("all")
    onClientChange("all")
  }

  return (
    <div className="bg-white border rounded-xl w-full max-w-full">
      <div className="bg-slate-50 px-3 md:px-4 py-4 sm:py-5 rounded-xl overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
          <span className="text-xs sm:text-sm text-gray-900 md:w-20 flex-shrink-0">필터</span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
            <Select value={selectedCompetition} onValueChange={onCompetitionChange}>
              <SelectTrigger className="w-full sm:w-32 shadow-none bg-white text-gray-700 font-normal text-xs">
                <SelectValue placeholder="경쟁강도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 경쟁강도</SelectItem>
                {competitionLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClient} onValueChange={onClientChange}>
              <SelectTrigger className="w-full sm:w-32 shadow-none bg-white text-gray-700 font-normal text-xs">
                <SelectValue placeholder="고객사" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 고객사</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              className="shadow-none text-xs h-8 sm:h-9 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              초기화
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
