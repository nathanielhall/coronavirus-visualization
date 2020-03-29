export type Country = {
  name: string
  code: string
}
export type CountriesApi = {
  countries: { name: string; iso2: string; iso3: string }[]
}

export type CountryStatistics = {
  confirmed: number
  deaths: number
  recovered: number
  timelines: Array<TimelineValue>
}
export type TimelineValue = {
  key: string // formatted date
  confirmed: number
  type: 'confirmed' | 'deaths' | 'recovered'
}

// Country Statistics Api
export type CountryStatisticsApi = {
  locations: {
    coordinates: { latitude: number; longitude: number }
    country: string
    country_code: string
    province?: string
    county?: string
    id: number
    last_updated: Date
    latest: { confirmed: number; deaths: number; recovered: number }
    timelines: { confirmed: { timeline: { [key: string]: number } } }
  }[]
}
