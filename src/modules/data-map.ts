import {
  CountryReport,
  StateReport,
  Report,
  StateDailyReport,
  CountryDailyReport,
  DailyReport,
  Location
} from './types'
import { getStateName } from './states'
import { differenceInCalendarDays, parse } from 'date-fns'

export const stateReportToReport: (
  data: StateReport[],
  selectedItem: string
) => Report | undefined = (data, selectedItem) => {
  const item = data.find((x) => x.state === selectedItem)
  if (!item) return

  return {
    title: getStateName(item.state),
    positive: item.positive,
    death: item.death,
    lastModified: item.lastUpdateEt
  }
}
export const countryReportToReport = (data: CountryReport) => {
  const { positive, death, lastModified } = data
  return {
    title: 'United States',
    positive,
    death,
    lastModified
  }
}

export const stateTimelineToTimeline = (
  data: StateDailyReport[],
  selectedItem: string
) => {
  const daily = data.filter((x) => x.state === selectedItem).reverse()

  const report: DailyReport[] = daily.map((item) => ({
    positive: item.positive,
    death: item.death,
    days: differenceInCalendarDays(
      parse(item.date.toString(), 'yyyyMMdd', new Date()),
      new Date('03/04/2020')
    ),
    growth: 0
  }))

  for (let i = 0; i < report.length; i++) {
    if (i > 0) {
      report[i].growth = report[i].positive - report[i - 1].positive
    }
  }

  return report
}

export const countryTimelineToTimeline = (data: CountryDailyReport[]) => {
  const report: DailyReport[] = data.map((item) => ({
    positive: item.positive,
    death: item.death,
    days: differenceInCalendarDays(
      parse(item.date.toString(), 'yyyyMMdd', new Date()),
      new Date('03/04/2020') // FIXME:
    ),
    growth: 0
  }))

  const sorted = report.sort((a, b) => {
    if (a.days < b.days) return -1
    return 1
  })

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      sorted[i].growth = sorted[i].positive - sorted[i - 1].positive
      //growth percentage = sorted[i - 1].positive / (sorted[i].positive - sorted[i - 1].positive)
    }
  }

  return sorted
}

export const filterCountiesByState = (
  data: Location[],
  selectedNav: string
) => {
  return data.filter((x) => x.province === getStateName(selectedNav))
}
