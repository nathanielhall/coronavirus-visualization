import React, { FC, useState, useEffect, ChangeEvent } from 'react'
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

type CountryData = {
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
export type AppProps = {}
export const App: FC<AppProps> = () => {
  // retrieve all countries
  const [countriesRequest] = useApi<CountriesApi>()
  const [countries, setCountries] = useState<Country[]>()

  //
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [statsRequest, statsResponse] = useApi<CountryData[]>(
    selectedCountry
      ? `https://covid19.mathdro.id/api/countries/${selectedCountry.code}/confirmed`
      : undefined
  )

  // Get list of countries for SELECT
  useEffect(() => {
    const getCountries = async () => {
      countriesRequest
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

  const handleCountryChange = (
    event: ChangeEvent<{}>,
    value: Country | null
  ) => {
    console.log(event)
    if (value) setSelectedCountry(value)
  }

  if (!countries) return null

  return (
    <React.Fragment>
      <Header title="Coronavirus Visualization">
        <Autocomplete
          name="countries"
          data={countries}
          inputLabel={''}
          disableCloseOnSelect
          value={selectedCountry}
          onChange={handleCountryChange}
          getOptionLabel={(option: Country) => option.name}
          renderOption={(option: Country) => (
            <>
              <span>{option.code}</span>
              {option.name}
            </>
          )}
        />
      </Header>
      <main>
        {statsRequest.loading && <span>Loading...</span>}
        {statsRequest.error && <div>Error!</div>}
        {statsResponse && statsResponse.data && statsResponse.data.length > 0 && (
          <Map
            center={[statsResponse.data[0].lat, statsResponse.data[0].long]}
            zoom={3}
          >
            {statsResponse.data.map((confirmed, index) => (
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
                        {confirmed.provinceState || confirmed.countryRegion}
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
