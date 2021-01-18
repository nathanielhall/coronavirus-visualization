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

export type LocationsApi = {
  latest: LocationCount
  locations: Location[]
}

export type RecentReport = { positive: number; deaths: number }

export type DailyReport = {
  positive: number
  death: number
  days: number
  date: Date
  positiveIncrease: number
  deathIncrease: number
  totalTestResultsIncrease: number
  hospitalizedIncrease: number
}

export type Report = {
  title: string
  positive: number
  death: number
  lastModified: Date
  // hospitalized: number
  // hospitalizedCurrently: number
  // inIcuCurrently: number
  // onVentilatorCurrently: number
}

export type CountryReport = {
  positive: number
  negative: number
  pending: number
  hospitalizedCurrently: number
  hospitalizedCumulative: number
  inIcuCurrently: number
  inIcuCumulative: number
  onVentilatorCurrently: number
  onVentilatorCumulative: number
  recovered: number
  //hash: number : number73b7f127f2bcb86044258f4e57461db45e67e6e: number
  lastModified: Date
  death: number
  hospitalized: number
  total: number
  totalTestResults: number
  posNeg: number
  notes: string
}

export type CountryDailyReport = {
  date: Date
  states: number
  positive: number
  negative: number
  pending: number
  hospitalizedCurrently: number
  hospitalizedCumulative: number
  inIcuCurrently: number
  inIcuCumulative: number
  onVentilatorCurrently: number
  onVentilatorCumulative: number
  recovered: number
  //hash: GUID,
  dateChecked: Date
  death: number
  hospitalized: number
  total: number
  totalTestResults: number
  posNeg: number
  deathIncrease: number
  hospitalizedIncrease: number
  negativeIncrease: number
  positiveIncrease: number
  totalTestResultsIncrease: number
}
export type StateReport = {
  state: string
  positive: number
  positiveScore: number
  negativeScore: number
  negativeRegularScore: number
  commercialScore: number
  grade: string
  score: number
  negative: number
  pending: number
  hospitalizedCurrently: number
  hospitalizedCumulative: number
  inIcuCurrently: number
  inIcuCumulative: number
  onVentilatorCurrently: number
  onVentilatorCumulative: number
  recovered: number
  lastUpdateEt: Date
  checkTimeEt: Date
  death: number
  hospitalized: number
  total: number
  totalTestResults: number
  posNeg: number
  fips: string
  dateModified: Date
  dateChecked: Date
  notes: string
  //hash: guid
}

export type StateDailyReport = {
  date: number
  state: string
  positive: number
  negative: number
  pending: number
  hospitalizedCurrently: number
  hospitalizedCumulative: number
  inIcuCurrently: number
  inIcuCumulative: number
  onVentilatorCurrently: number
  onVentilatorCumulative: number
  recovered: number
  //hash: GUID,
  dateChecked: Date
  death: number
  hospitalized: number
  total: number
  totalTestResults: number
  posNeg: number
  fips: string
  deathIncrease: number
  hospitalizedIncrease: number
  negativeIncrease: number
  positiveIncrease: number
  totalTestResultsIncrease: number
}
