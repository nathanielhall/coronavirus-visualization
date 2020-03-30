import React, { FC, useState, useEffect } from 'react'
import { Map, MapMarker } from 'components/Map'
// import { Autocomplete } from 'components/Autocomplete'
import { Header } from 'components/Header'
import { Drawer } from 'components/Drawer'
import { useApi } from 'src/api'
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box
} from '@material-ui/core'
import { format } from 'date-fns'

// type Country = {
//   name: string
//   code: string
// }
// type CountriesApi = {
//   [key: string]: string
// }
// type CountryData = {
//   provinceState: string
//   countryRegion: string
//   lastUpdate: number
//   lat: number
//   long: number
//   confirmed: number
//   recovered: number
//   deaths: number
//   active: number
// }
// type MapDisplayProps = {
//   center: [number, number]
//   zoom: number
// }

type LocationCount = {
  confirmed: number
  deaths: number
  recovered: number
}

type Location = {
  id: number
  country: string
  country_code: string
  country_population: number
  province: string
  county: string
  last_updated: Date
  coordinates: { latitude: number; longitude: number }
  latest: LocationCount
}

// type CountryApi = {
//   location: Location
// }

type LocationsApi = {
  latest: LocationCount
  locations: Location[]
}

type Province = {
  name: string
  latitude: number
  longitude: number
  latest: LocationCount
  // lat / long
}

export type AppProps = {}
export const App: FC<AppProps> = () => {
  // const [countriesRequest] = useApi<CountriesApi>()
  // const [countries, setCountries] = useState<Country[]>()
  // const [selectedCountry, setSelectedCountry] = useState<Country | null>({
  //   code: 'US',
  //   name: 'US'
  // })
  // const [statsRequest, statsResponse] = useApi<CountryData[]>(
  //   selectedCountry
  //     ? `https://covid19.mathdro.id/api/countries/${selectedCountry.code}/confirmed`
  //     : undefined
  // )
  // const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  // const [mapDisplayProps, setMapDisplayProps] = useState<MapDisplayProps>({
  //   center: [40.4, -125.7],
  //   zoom: 4
  // })

  // const [, countryResponse] = useApi<CountryApi>(
  //   'https://coronavirus-tracker-api.herokuapp.com/v2/locations/225'
  // )

  const [locationsRequest, locationsResponse] = useApi<LocationsApi>(
    'https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=US&source=csbs'
  )

  const [provinces, setProvinces] = useState<Province[] | undefined>()

  // selectedLocation
  const [selectedProvince, setSelectedProvince] = useState<
    Province | undefined
  >()
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)

  // When app first loads, retrieve countries and format data
  useEffect(() => {
    if (!locationsResponse) return

    const { locations } = locationsResponse.data

    const result = locations.reduce((acc: Province[], curr) => {
      const item = acc.find((x) => x.name === curr.province)
      if (item) {
        item.latest.confirmed += curr.latest.confirmed
        item.latest.deaths += curr.latest.deaths
        item.latest.recovered += curr.latest.recovered
      } else {
        const newItem: Province = {
          name: curr.province,
          latitude: curr.coordinates.latitude,
          longitude: curr.coordinates.longitude,
          latest: {
            confirmed: curr.latest.confirmed,
            deaths: curr.latest.deaths,
            recovered: curr.latest.recovered
          }
        }
        acc.push(newItem)
      }

      return acc
    }, [])

    setProvinces(
      result.sort((a, b) => {
        if (a.name < b.name) return -1
        return 1
      })
    )
    const selected = result.find((x) => x.name === 'Virginia')
    setSelectedProvince(selected)
  }, [locationsResponse])

  // when country statistics are retrieved move the center position and zoom
  // useEffect(() => {
  //   setMapDisplayProps({
  //     center:
  //       statsResponse && statsResponse.data.length > 0
  //         ? [statsResponse.data[0].lat, statsResponse.data[0].long]
  //         : [40.4, -95.7],
  //     zoom: 4
  //   })
  // }, [statsResponse])

  const listItemClick = (item: Province) => {
    setSelectedProvince(item)
  }

  const handleDrawerOpen = () => setOpenDrawer(true)
  const handleDrawerClose = () => setOpenDrawer(false)

  // wait for countries before rendering map
  if (!locationsResponse) return null

  return (
    <>
      <Header
        title="Coronavirus Visualization (US Only)"
        handleDrawerOpen={handleDrawerOpen}
      ></Header>

      <main>
        <Map
          center={
            selectedProvince
              ? [selectedProvince.latitude, selectedProvince.longitude]
              : [40.4, -125.7]
          }
          zoom={6}
        >
          {locationsRequest.loading === false &&
            locationsResponse &&
            selectedProvince &&
            locationsResponse.data.locations
              .filter((x) => x.province === selectedProvince.name)
              .map((loc, index) => (
                <MapMarker
                  id={index}
                  key={index}
                  onClose={() => console.log('closed')}
                  position={[
                    loc.coordinates.latitude,
                    loc.coordinates.longitude
                  ]}
                >
                  <Statistics data={loc} />
                </MapMarker>
              ))}
        </Map>
      </main>
      <Drawer handleDrawerClose={handleDrawerClose} open={openDrawer}>
        <List>
          {provinces &&
            provinces.map((item, index) => (
              <ListItem
                button
                selected={
                  selectedProvince && item.name === selectedProvince.name
                }
                key={index}
                onClick={() => listItemClick(item)}
              >
                <ListItemText
                  primary={`${item.name} (${item.latest.confirmed})`}
                  secondary={`Deaths: ${item.latest.deaths} Recovered: ${item.latest.recovered}`}
                />
              </ListItem>
            ))}
        </List>
      </Drawer>
    </>
  )
}

export type StatisticsProps = {
  data: Location
}

import { makeStyles } from '@material-ui/styles'
import { grey } from '@material-ui/core/colors'

const useStyles = makeStyles({
  statLabel: {
    fontSize: 12,
    color: grey[500],
    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    margin: 0
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: '1px'
  }
})

export const Statistics: FC<StatisticsProps> = ({ data }) => {
  const styles = useStyles()
  return (
    <div>
      <Box>
        <Typography variant="h6">
          {`${data.province} -  ${data.county} County`}
        </Typography>
      </Box>
      <Box display={'flex'} textAlign={'center'}>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Confirmed</p>
          <p className={styles.statValue}>
            {data.latest.confirmed.toLocaleString()}
          </p>
        </Box>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Deaths</p>
          <p className={styles.statValue}>
            {data.latest.deaths.toLocaleString()}
          </p>
        </Box>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Recovered</p>
          <p className={styles.statValue}>
            {data.latest.recovered.toLocaleString()}
          </p>
        </Box>
      </Box>

      <p className={styles.statLabel}>
        {format(new Date(data.last_updated), 'MM/dd/yyyy hh:mm')}
      </p>
    </div>
  )
}
