import { useApi } from 'src/api'
import {
  LocationsApi,
  StateDailyReport,
  StateReport,
  CountryDailyReport,
  CountryReport,
  DailyReport,
  NavListItem
} from './types'
import { getStateName } from './states'
import { differenceInCalendarDays, parse } from 'date-fns'

const UNITED_STATES = 'US'

export const useReport = (location: string) => {
  // Country -------------------------------------------------
  const [requestCountry, responseCountry] = useApi<CountryReport[]>(
    'https://api.covidtracking.com/v1/us/current.json'
  )
  // States ---------------------------------------------------
  const [requestStates, responseStates] = useApi<StateReport[]>(
    'https://api.covidtracking.com/v1/states/current.json'
  )

  /** get the latest reportings for the selected navigation item (US or State) */
  const getData = () => {
    if (location === 'US') {
      if (requestCountry.loading || !responseCountry) return

      const { positive, death, lastModified } = responseCountry.data[0]
      return {
        title: 'United States',
        positive,
        death,
        lastModified
      }
    } else {
      if (requestStates.loading || !responseStates) return
      const item = responseStates.data.find((x) => x.state === location)
      if (!item) return

      return {
        title: getStateName(item.state),
        positive: item.positive,
        death: item.death,
        lastModified: item.lastUpdateEt
      }
    }
  }

  const loading = requestCountry.loading || requestStates.loading
  const data = loading ? [] : getData()

  return [loading, data]
}

export const useTimelineReport = () => {
  // Country Timeline -----------------------------------------
  const [requestCountryTimeline, responseCountryTimeline] = useApi<
    CountryDailyReport[]
  >('https://api.covidtracking.com/v1/us/daily.json')

  // States Timeline ---------------------------------------------
  const [requestStatesTimeline, responseStatesTimeline] = useApi<
    StateDailyReport[]
  >('https://api.covidtracking.com/v1/states/daily.json')

  /** get daily report (timeline) for the selected navigation item */
  const getData = (selectedNavItem: NavListItem) => {
    if (selectedNavItem.id === UNITED_STATES) {
      if (requestCountryTimeline.loading || !responseCountryTimeline) return
      const report: DailyReport[] = responseCountryTimeline.data.map(
        (item) => ({
          positive: item.positive,
          death: item.death,
          days: differenceInCalendarDays(
            parse(item.date.toString(), 'yyyyMMdd', new Date()),
            new Date('03/04/2020') // FIXME:
          ),
          growth: 0
        })
      )

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
    } else {
      if (requestStatesTimeline.loading || !responseStatesTimeline) return

      const daily = responseStatesTimeline.data
        .filter((x) => x.state === selectedNavItem.id)
        .reverse()

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
  }

  return {
    loading: requestCountryTimeline.loading || requestStatesTimeline.loading,
    getData
  }
}

export const useCountiesReport = () => {
  // Counties ------------------------------------------------
  const [requestCounties, responseCounties] = useApi<LocationsApi>(
    'https://covid-tracker-us.herokuapp.com/v2/locations?country_code=US&source=csbs'
  )

  /** get the latest reportings for the selected state */
  const getData = (selectedNavItem: NavListItem) => {
    if (selectedNavItem.id === UNITED_STATES) return undefined

    if (requestCounties.loading || !responseCounties) return

    const result = responseCounties.data.locations.filter(
      (x) => x.province === getStateName(selectedNavItem.id)
    )

    return result
  }

  return {
    loading: requestCounties.loading,
    getData
  }
}
