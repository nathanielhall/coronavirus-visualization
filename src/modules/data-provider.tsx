import { useApi } from 'src/api'
import {
  LocationsApi,
  StateDailyReport,
  StateReport,
  CountryDailyReport,
  CountryReport,
  DailyReport,
  Report,
  Location
} from './types'
import { getStateName } from './states'
import { differenceInCalendarDays, parse } from 'date-fns'
import { useEffect, useState } from 'react'

const UNITED_STATES = 'US'

export const useReport: (
  navSelection: string
) => [boolean, Report | undefined] = (navSelection: string) => {
  // Country -------------------------------------------------
  const [requestCountry, responseCountry] = useApi<CountryReport[]>(
    'https://api.covidtracking.com/v1/us/current.json'
  )
  // States ---------------------------------------------------
  const [requestStates, responseStates] = useApi<StateReport[]>(
    'https://api.covidtracking.com/v1/states/current.json'
  )

  const [data, setData] = useState<Report | undefined>(undefined)

  useEffect(() => {
    if (navSelection === 'US') {
      if (requestCountry.loading || !responseCountry) return

      const { positive, death, lastModified } = responseCountry.data[0]
      setData({
        title: 'United States',
        positive,
        death,
        lastModified
      })
    } else {
      if (requestStates.loading || !responseStates) return
      const item = responseStates.data.find((x) => x.state === navSelection)
      if (!item) return

      setData({
        title: getStateName(item.state),
        positive: item.positive,
        death: item.death,
        lastModified: item.lastUpdateEt
      })
    }
  }, [requestCountry, requestStates])

  const loading = !data
  return [loading, data]
}

export const useTimelineReport = (navSelection: string) => {
  // Country Timeline -----------------------------------------
  const [requestCountryTimeline, responseCountryTimeline] = useApi<
    CountryDailyReport[]
  >('https://api.covidtracking.com/v1/us/daily.json')

  // States Timeline ---------------------------------------------
  const [requestStatesTimeline, responseStatesTimeline] = useApi<
    StateDailyReport[]
  >('https://api.covidtracking.com/v1/states/daily.json')

  const [data, setData] = useState<DailyReport[] | undefined>(undefined)

  useEffect(() => {
    if (navSelection === UNITED_STATES) {
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

      setData(sorted)
    } else {
      if (requestStatesTimeline.loading || !responseStatesTimeline) return

      const daily = responseStatesTimeline.data
        .filter((x) => x.state === navSelection)
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

      setData(report)
    }
  }, [requestCountryTimeline, requestStatesTimeline])

  const loading = !data // assume still loading if data has not been set #TODO: add type to determine errors
  return [loading, data]
}

export const useCountiesReport = (navSelection: string) => {
  // Counties ------------------------------------------------
  const [requestCounties, responseCounties] = useApi<LocationsApi>(
    'https://covid-tracker-us.herokuapp.com/v2/locations?country_code=US&source=csbs'
  )

  const [data, setData] = useState<Location[] | undefined>(undefined)

  useEffect(() => {
    if (navSelection === UNITED_STATES) return

    if (requestCounties.loading || !responseCounties) return

    const result = responseCounties.data.locations.filter(
      (x) => x.province === getStateName(navSelection)
    )

    setData(result)
  }, [requestCounties])

  const loading = !data // assume still loading if data has not been set #TODO: add type to determine errors
  return [loading, data]
}
