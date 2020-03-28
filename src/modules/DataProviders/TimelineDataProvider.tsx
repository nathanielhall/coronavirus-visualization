import { useState, useEffect } from 'react'
import { useApi } from 'src/api'
import { format } from 'date-fns'
import { DataProvider } from './types'

export type Statistic = {
  key: string // formatted date
  confirmed: number
  type: 'confirmed' | 'deaths' | 'recovered'
}
type CountryStatisticsApi = {
  locations: Array<CountryStatistics>
}
type CountryStatistics = {
  coordinates: { latitude: number; longitude: number }
  country: string
  country_code: string
  id: number
  last_updated: Date
  latest: { confirmed: number; deaths: number; recovered: number }
  province: string
  timelines: { confirmed: { timeline: { [key: string]: number } } }
}

// type TimelineDataProviderType = DataProvider<Statistic> & {
//   reload: (countryCode: string) => void
// }

export const TimelineDataProvider: (
  countryCode?: string
) => DataProvider<Statistic> = (countryCode = 'US') => {
  const [request] = useApi<CountryStatisticsApi>()
  const [data, setData] = useState<Statistic[]>()

  const getStatistics = async (code: string) => {
    request
      .get<CountryStatisticsApi>(
        `https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=${code}&timelines=1`
      )
      .then((response) => {
        if (response.status === 200) {
          const { locations } = response.data

          if (!locations || locations.length <= 0) return
          const timeline = locations[0].timelines.confirmed.timeline
          const confirmedCases: Statistic[] = Object.entries(timeline).map(
            ([key, value]) => ({
              key: format(new Date(key), 'MM-dd'),
              confirmed: value,
              type: 'confirmed'
            })
          )

          setData(confirmedCases)
        }
      })
  }

  useEffect(() => {
    getStatistics(countryCode)
  }, [])

  return [request.status, data, request.error, getStatistics]
}
