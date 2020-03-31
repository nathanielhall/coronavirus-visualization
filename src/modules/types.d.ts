export type LocationCount = {
  confirmed: number
  deaths: number
  recovered: number
}

export type Location = {
  id: number
  country: string
  country_code: string
  country_population: number
  province: string
  county: string
  last_updated: Date
  coordinates: { latitude: number; longitude: number }
  latest: LocationCount
  timelines: { confirmed: { timeline: { [key: string]: number } } }
}

export type CountryApi = {
  location: Location
}

export type LocationsApi = {
  latest: LocationCount
  locations: Location[]
}

export type Province = {
  name: string
  latitude: number
  longitude: number
  latest: LocationCount
}

export type TimelineValue = {
  key: string // formatted date
  confirmed: number
  type: 'confirmed' | 'deaths' | 'recovered'
}
