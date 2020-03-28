export type Country = {
  name: string
  code: string
}
export type CountriesApi = {
  countries: { name: string; iso2: string; iso3: string }[]
}

export type Statistic = {
  key: string // formatted date
  confirmed: number
  type: 'confirmed' | 'deaths' | 'recovered'
}
export type CountryStatisticsApi = {
  locations: Array<CountryStatistics>
}
export type CountryStatistics = {
  coordinates: { latitude: number; longitude: number }
  country: string
  country_code: string
  id: number
  last_updated: Date
  latest: { confirmed: number; deaths: number; recovered: number }
  province: string
  timelines: { confirmed: { timeline: { [key: string]: number } } }
}
