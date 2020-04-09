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
    yAxis: item.positive,
    xAxis: differenceInCalendarDays(
      parse(item.date.toString(), 'yyyyMMdd', new Date()),
      new Date('03/04/2020')
    )
  }))

  return report
}

export const countryTimelineToTimeline = (data: CountryDailyReport[]) => {
  const report: DailyReport[] = data.map((item) => ({
    positive: item.positive,
    death: item.death,
    xAxis: differenceInCalendarDays(
      parse(item.date.toString(), 'yyyyMMdd', new Date()),
      new Date('03/04/2020') // FIXME:
    ),
    yAxis: item.positive
  }))

  return report.sort((a, b) => {
    if (a.xAxis < b.xAxis) return -1
    return 1
  })
}

export const filterCountiesByState = (
  data: Location[],
  selectedNav: string
) => {
  return data.filter((x) => x.province === getStateName(selectedNav))
}
