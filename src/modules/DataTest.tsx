import React, { FC, useState, useEffect } from 'react'
import {
  Country,
  CountriesApi,
  Statistic,
  // CountryStatistics,
  CountryStatisticsApi
} from './types'
import { useApi } from 'src/api'
import { format } from 'date-fns'
import { Typography } from '@material-ui/core'
import { Autocomplete } from 'components/Autocomplete'

export type DataTestProps = {}
export const DataTest: FC<DataTestProps> = () => {
  // Countries
  const [countriesReq] = useApi<CountriesApi>()
  const [countries, setCountries] = useState<Country[]>()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>({
    code: 'US',
    name: 'US'
  })

  // Country Statistics
  const [statsReq] = useApi<CountryStatisticsApi>()
  const [statistics, setStatistics] = useState<Statistic[]>()

  // Load contries when app loads
  // TODO: cache?
  useEffect(() => {
    const getCountries = async () => {
      countriesReq
        .get<CountriesApi>('https://covid19.mathdro.id/api/countries')
        .then((response) => {
          if (response.status === 200) {
            const allCountries: Country[] = response.data.countries.map(
              (country) => ({ name: country.name, code: country.iso2 })
            )

            console.log('countries retrieved', 'Countries')
            setCountries(allCountries)
          }
        })
    }

    getCountries()
  }, [])

  // Load statistics for selected country
  useEffect(() => {
    const getStatistics = async (code: string) => {
      statsReq
        .get<CountryStatisticsApi>(
          `https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=${code}&timelines=1`
        )
        .then((response) => {
          if (response.status === 200) {
            debugger
            const { locations } = response.data

            if (!locations || locations.length <= 0) return

            // FIXME: pulling first item in array... review this!
            const timeline = locations[0].timelines.confirmed.timeline
            const confirmedCases: Statistic[] = Object.entries(timeline).map(
              ([key, value]) => ({
                key: format(new Date(key), 'MM-dd'),
                confirmed: value,
                type: 'confirmed'
              })
            )

            setStatistics(confirmedCases)
          }
        })
    }

    if (selectedCountry) {
      console.log(selectedCountry, 'SELECTED')
      getStatistics(selectedCountry.code)
    } else {
      console.log('Selected Country: ---', 'SELECTED')
    }
  }, [selectedCountry])

  return (
    <>
      <Typography variant="h4">Countries</Typography>
      {(countriesReq.status === 'idle' ||
        countriesReq.status === 'pending') && <span>Loading...</span>}
      {countriesReq.status === 'rejected' && (
        <span>{countriesReq.error || 'ERROR'}</span>
      )}
      {countries && (
        <Autocomplete
          name="countries"
          data={countries}
          inputLabel={''}
          value={selectedCountry}
          onChange={(e, value) => {
            console.log(e)
            console.log(value, 'VAL') // FIXME: how to ignore parameter e??

            if (value) setSelectedCountry(value)
          }}
          getOptionLabel={(option: Country) => option.code}
          renderOption={(option: Country) => (
            <>
              <span>{option.code}</span>
              {option.name}
            </>
          )}
        />
      )}
      {countries && <pre>{JSON.stringify(countries, null, 2)}</pre>}

      <Typography variant="h4">Statistics</Typography>
      {(statsReq.status === 'idle' || statsReq.status === 'pending') && (
        <span>Loading...</span>
      )}
      {statsReq.status === 'rejected' && (
        <span>{statsReq.error || 'ERROR'}</span>
      )}

      {statistics && <pre>{JSON.stringify(statistics, null, 2)}</pre>}
    </>
  )
}
