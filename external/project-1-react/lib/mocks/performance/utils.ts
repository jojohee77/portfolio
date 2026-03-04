import { teamMetricsData } from './team-metrics'
import type { MetricType, MonthKey, TeamMetricData } from './types'

/**
 * 특정 팀의 특정 지표 월별 데이터 가져오기
 */
export function getTeamMetricData(
  teamName: string,
  metric: MetricType,
  months: MonthKey[]
): Array<{ month: MonthKey; value: number; change: number }> {
  const teamData = teamMetricsData.find((t) => t.team === teamName)
  if (!teamData) return []

  return months.map((month) => {
    const data = teamData.metrics[metric][month]
    return {
      month,
      value: data.value,
      change: data.change,
    }
  })
}

/**
 * 차트 데이터 형식으로 변환 (value만)
 */
export function getChartData(
  teamName: string,
  metric: MetricType,
  months: MonthKey[]
): Array<{ month: MonthKey; value: number }> {
  return getTeamMetricData(teamName, metric, months).map(({ month, value }) => ({
    month,
    value,
  }))
}

/**
 * 테이블 데이터 형식으로 변환 (모든 팀)
 */
export function getTableData(
  metric: MetricType,
  months: MonthKey[]
): Array<{ team: string; data: Record<MonthKey, { value: number; change: number }> }> {
  return teamMetricsData.map((teamData) => ({
    team: teamData.team,
    data: months.reduce((acc, month) => {
      acc[month] = teamData.metrics[metric][month]
      return acc
    }, {} as Record<MonthKey, { value: number; change: number }>),
  }))
}

/**
 * 전체 팀의 특정 지표 월별 데이터 (차트용 - 전체 선택 시)
 */
export function getAllTeamsMetricData(
  metric: MetricType,
  months: MonthKey[]
): Array<Record<string, number | MonthKey>> {
  return months.map((month) => {
    const row: Record<string, number | MonthKey> = { month }
    teamMetricsData.forEach((teamData) => {
      row[teamData.team] = teamData.metrics[metric][month].value
    })
    return row
  })
}

/**
 * 특정 팀의 특정 월 데이터 가져오기
 */
export function getTeamMonthData(
  teamName: string,
  month: MonthKey
): Record<MetricType, { value: number; change: number }> {
  const teamData = teamMetricsData.find((t) => t.team === teamName)
  if (!teamData) return {} as Record<MetricType, { value: number; change: number }>

  const result = {} as Record<MetricType, { value: number; change: number }>
  ;(Object.keys(teamData.metrics) as MetricType[]).forEach((metric) => {
    result[metric] = teamData.metrics[metric][month]
  })
  return result
}

