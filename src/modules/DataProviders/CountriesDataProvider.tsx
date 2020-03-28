import { useState, useEffect } from 'react'
import { useApi } from 'src/api'
import { DataProvider } from './types'
// import { format } from 'date-fns'

export type Country = {
  name: string
  code: string
}
type CountriesApi = {
  [key: string]: string
}

export const CountriesDataProvider: () => DataProvider<Country> = () => {
  const [request] = useApi<CountriesApi>()
  const [data, setData] = useState<Country[]>()

  useEffect(() => {
    const getCountries = async () => {
      request
        .get<CountriesApi>('https://covid19.mathdro.id/api/countries')
        .then((response) => {
          if (response.status === 200) {
            const myCountries: Country[] = Object.entries(
              response.data.countries
            ).map(([country, code]) => {
              return { name: country, code }
            })
            setData(myCountries)
          }
        })
    }

    getCountries()
  }, [])

  return [request.status, data, request.error, undefined]
}
