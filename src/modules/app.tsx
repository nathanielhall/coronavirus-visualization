import React, { FC, useState, useEffect } from 'react'
import { Map, MapMarker } from 'components/Map'
import { useApi } from 'src/api'
import { Typography } from '@material-ui/core'
import { Autocomplete } from 'components/Autocomplete'
import { Header } from 'components/Header'

type Country = {
  name: string
  code: string
}

type CountriesApi = {
  [key: string]: string
}

export const CountrySelect = () => {
  const [countries, setCountries] = useState<Country[]>()
  const [request] = useApi<CountriesApi>()

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
            setCountries(myCountries)
          }
        })
    }

    getCountries()
  }, [])

  if (!countries) return null

  // return <pre>{JSON.stringify(countries, null, 2)}</pre>
  return (
    <Autocomplete
      name="countries"
      data={countries}
      inputLabel={''}
      disableCloseOnSelect
      getOptionLabel={(option: Country) => option.name}
      renderOption={(option: Country) => (
        <>
          <span>{option.code}</span>
          {option.name}
        </>
      )}
    />
  )
}

export type AppProps = {}
export const App: FC<AppProps> = () => {
  type ConfirmedType = {
    provinceState: string
    countryRegion: string
    lastUpdate: number
    lat: number
    long: number
    confirmed: number
    recovered: number
    deaths: number
    active: number
  }

  const [request, response] = useApi<ConfirmedType[]>(
    'https://covid19.mathdro.id/api/countries/US/confirmed'
  )

  return (
    <React.Fragment>
      <Header title="Coronavirus Visualization">
        <CountrySelect />
      </Header>
      <main>
        {request.loading && <span>Loading...</span>}
        {request.error && <div>Error!</div>}
        {response && (
          <Map center={[40.4, -95.7]} zoom={5}>
            {response.data.map((confirmed, index) => (
              <MapMarker
                id={index}
                key={index}
                onClose={() => console.log('closed')}
                position={[confirmed.lat, confirmed.long]}
              >
                <div>
                  <div>
                    <span>
                      <Typography variant="h5">
                        {confirmed.provinceState}
                      </Typography>
                    </span>
                  </div>
                  <div>
                    <label>Confirmed</label>&nbsp;
                    <span>{confirmed.confirmed}</span>
                  </div>
                  <div>
                    <label>Deaths</label>&nbsp;
                    <span>{confirmed.deaths}</span>
                  </div>
                  <div>
                    <label>Recovered</label>&nbsp;
                    <span>{confirmed.recovered}</span>
                  </div>
                </div>
              </MapMarker>
            ))}
          </Map>
        )}
      </main>
    </React.Fragment>
  )
}
