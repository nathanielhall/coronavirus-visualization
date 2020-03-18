import React, { FC, useState, useEffect } from 'react'
import { Map, MapMarker } from 'components/Map'
import { useApi } from 'src/api'
import { Typography } from '@material-ui/core'
import { Autocomplete } from 'components/Autocomplete'
import { Header } from 'components/Header'
import { Drawer } from 'components/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

// TODO: break this component up? Too big
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
type MapDisplayProps = {
  center: [number, number]
  zoom: number
}
export type AppProps = {}
export const App: FC<AppProps> = () => {
  const [countriesRequest] = useApi<CountriesApi>()
  const [countries, setCountries] = useState<Country[]>()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [statsRequest, statsResponse] = useApi<CountryData[]>(
    selectedCountry
      ? `https://covid19.mathdro.id/api/countries/${selectedCountry.code}/confirmed`
      : undefined
  )
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [mapDisplayProps, setMapDisplayProps] = useState<MapDisplayProps>({
    center: [40.4, -95.7],
    zoom: 4
  })

  const listItemClick = (item: CountryData) => {
    const newProps: MapDisplayProps = {
      center: [item.lat, item.long],
      zoom: 7
    }

    setMapDisplayProps(newProps)
  }

  // Get list of countries for <Autocomplete /> and apply data manipulations
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

  useEffect(() => {
    setMapDisplayProps({
      center:
        statsResponse && statsResponse.data.length > 0
          ? [statsResponse.data[0].lat, statsResponse.data[0].long]
          : [40.4, -95.7],
      zoom: 4
    })
  }, [statsResponse])

  const handleDrawerOpen = () => setOpenDrawer(true)
  const handleDrawerClose = () => setOpenDrawer(false)

  // TODO: Restructure page
  //    1) Ensure map is always present
  //    2) how handle api loading and errors (inside map and outside such as countries for autocomplete)
  //    3) default country basd on users location
  if (!countries) return null

  return (
    <React.Fragment>
      <Header
        title="Coronavirus Visualization"
        handleDrawerOpen={handleDrawerOpen}
      >
        <Autocomplete
          name="countries"
          data={countries}
          inputLabel={''}
          disableCloseOnSelect
          value={selectedCountry}
          onChange={(e, value) => {
            console.log(e) // FIXME: how to ignore parameter e??
            if (value) setSelectedCountry(value)
          }}
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
        <Map center={mapDisplayProps.center} zoom={mapDisplayProps.zoom}>
          {statsRequest.loading && <span>Loading...</span>}
          {statsRequest.error && <div>Error!</div>}
          {statsResponse &&
            statsResponse.data.map((confirmed, index) => (
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
      </main>
      <Drawer handleDrawerClose={handleDrawerClose} open={openDrawer}>
        <List>
          {statsResponse &&
            statsResponse.data &&
            statsResponse.data.map((item, index) => (
              <ListItem button key={index} onClick={() => listItemClick(item)}>
                <ListItemText
                  primary={`${item.provinceState || item.countryRegion} (${
                    item.confirmed
                  })`}
                  secondary={`Deaths: ${item.deaths} Recovered: ${item.recovered}`}
                />
              </ListItem>
            ))}
        </List>
      </Drawer>
    </React.Fragment>
  )
}
