import { useApi } from 'src/api'
import {
  LocationsApi,
  StateDailyReport,
  StateReport,
  CountryDailyReport,
  CountryReport,
  DailyReport,
  Report,
  Location,
  RecentReport
} from '../types'
import { getStateName } from './states'
import { parse } from 'date-fns'
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
    if (navSelection === UNITED_STATES) {
      if (requestCountry.loading || !responseCountry) return

      console.log('process report')
      const { positive, death, lastModified } = responseCountry.data[0]
      setData({
        title: 'United States',
        positive,
        death,
        lastModified
      })
    }
  }, [navSelection, responseCountry])

  useEffect(() => {
    if (navSelection !== UNITED_STATES) {
      if (requestStates.loading || !responseStates) return

      console.log('process report')
      const item = responseStates.data.find((x) => x.state === navSelection)
      if (!item) return

      setData({
        title: getStateName(item.state),
        positive: item.positive,
        death: item.death,
        lastModified: item.lastUpdateEt
      })
    }
  }, [navSelection, responseStates])

  const loading = !data
  return [loading, data]
}

export const useTimelineReport: (
  navSelection: string
) => [boolean, DailyReport[] | undefined, RecentReport] = (
  navSelection: string
) => {
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
    console.log(
      `useEffect (COUNTRY) Selection: ${navSelection} Loading: ${
        requestCountryTimeline.loading
      } EmptyResponse: ${!responseCountryTimeline}`
    )

    if (navSelection === UNITED_STATES) {
      if (requestCountryTimeline.loading || !responseCountryTimeline) return

      console.log('process data')

      const daily = responseCountryTimeline.data

      const report: DailyReport[] = daily.reverse().map(asDailyReport)

      setData(report.filter((x) => x.positive > 0))
    }
  }, [navSelection, requestCountryTimeline.loading])

  useEffect(() => {
    console.log(
      `useEffect (STATE) Selection: ${navSelection} Loading: ${
        requestStatesTimeline.loading
      } EmptyResponse: ${!responseStatesTimeline}`
    )
    if (navSelection !== UNITED_STATES) {
      if (requestStatesTimeline.loading || !responseStatesTimeline) return

      const daily = responseStatesTimeline.data
        .filter((x) => x.state === navSelection)
        .reverse()

      const report: DailyReport[] = daily.map(asDailyReport)

      console.log(report, 'REPORT')
      setData(report.filter((x) => x.positive > 0))
    }
  }, [navSelection, requestStatesTimeline.loading])

  const loading = !data // assume still loading if data has not been set #TODO: add type to determine errors

  const lastTwoWeeks = !!data ? data.slice(data.length - 14) : []

  const recent = lastTwoWeeks.reduce(
    (acc: RecentReport, curr: DailyReport) => {
      acc.positive += curr.positiveIncrease
      acc.deaths += curr.deathIncrease

      return acc
    },
    { positive: 0, deaths: 0 }
  )

  return [loading, data, recent]
}

const asDailyReport: (
  item: StateDailyReport | CountryDailyReport,
  idx: number
) => DailyReport = (item, idx) => {
  return {
    positive: item.positive,
    death: item.death,
    days: idx,
    date: parse(item.date.toString(), 'yyyyMMdd', new Date()),
    positiveIncrease: nonNegative(item.positiveIncrease),
    deathIncrease: nonNegative(item.deathIncrease),
    totalTestResultsIncrease: nonNegative(item.totalTestResultsIncrease),
    hospitalizedIncrease: nonNegative(item.hospitalizedIncrease)
  }
}

const nonNegative = (num: number) => (num < 0 ? 0 : num)

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

// const stateTimelineExample = {
//   date: 20201121,
//   state: 'AK',
//   positive: 26044,
//   probableCases: null,
//   negative: 892701,
//   pending: null,
//   totalTestResultsSource: 'totalTestsViral',
//   totalTestResults: 918745,
//   hospitalizedCurrently: 129,
//   hospitalizedCumulative: 612,
//   inIcuCurrently: null,
//   inIcuCumulative: null,
//   onVentilatorCurrently: 14,
//   onVentilatorCumulative: null,
//   recovered: 7165,
//   dataQualityGrade: 'A',
//   lastUpdateEt: '11/21/2020 03:59',
//   dateModified: '2020-11-21T03:59:00Z',
//   checkTimeEt: '11/20 22:59',
//   death: 102,
//   hospitalized: 612,
//   dateChecked: '2020-11-21T03:59:00Z',
//   totalTestsViral: 918745,
//   positiveTestsViral: 31523,
//   negativeTestsViral: 886676,
//   positiveCasesViral: null,
//   deathConfirmed: 102,
//   deathProbable: null,
//   totalTestEncountersViral: null,
//   totalTestsPeopleViral: null,
//   totalTestsAntibody: null,
//   positiveTestsAntibody: null,
//   negativeTestsAntibody: null,
//   totalTestsPeopleAntibody: null,
//   positiveTestsPeopleAntibody: null,
//   negativeTestsPeopleAntibody: null,
//   totalTestsPeopleAntigen: null,
//   positiveTestsPeopleAntigen: null,
//   totalTestsAntigen: null,
//   positiveTestsAntigen: null,
//   fips: '02',
//   positiveIncrease: 675,
//   negativeIncrease: 13358,
//   total: 918745,
//   totalTestResultsIncrease: 14033,
//   posNeg: 918745,
//   deathIncrease: 1,
//   hospitalizedIncrease: 6,
//   hash: '0d51b28ef5ce194e5dc76dcf4e15162d75123d17',
//   commercialScore: 0,
//   negativeRegularScore: 0,
//   negativeScore: 0,
//   positiveScore: 0,
//   score: 0,
//   grade: ''
// }

// const countryTimelineExample = {
//   date: 20201121,
//   states: 56,
//   positive: 11927256,
//   negative: 143010617,
//   pending: 17683,
//   hospitalizedCurrently: 83227,
//   hospitalizedCumulative: 540906,
//   inIcuCurrently: 16054,
//   inIcuCumulative: 28693,
//   onVentilatorCurrently: 5103,
//   onVentilatorCumulative: 3087,
//   recovered: 4529700,
//   dateChecked: '2020-11-21T24:00:00Z',
//   death: 247043,
//   hospitalized: 540906,
//   totalTestResults: 177614398,
//   lastModified: '2020-11-21T24:00:00Z',
//   total: 0,
//   posNeg: 0,
//   deathIncrease: 1506,
//   hospitalizedIncrease: 3241,
//   negativeIncrease: 1426550,
//   positiveIncrease: 178309,
//   totalTestResultsIncrease: 1977400,
//   hash: 'cf675a8bdc6204a364c0fe4779d944ae529c617d'
// }
