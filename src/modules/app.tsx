import React, { FC, useState, useEffect } from 'react'
import { Map, MapMarker } from 'components/Map'
import { Header } from 'components/Header'
import { Drawer } from 'components/Drawer'
import { GrowthChart } from './GrowthChart'
import { useApi } from 'src/api'
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button
} from '@material-ui/core'
import { format } from 'date-fns'
import {
  // LocationCount,
  Location,
  CountryApi,
  LocationsApi,
  Province
} from './types'

// FIXME: Find an API that can deliver results by state
// FIXME: Remove accumulation of totals and use new Api  / this has potential for bugs

export type AppProps = {}
export const App: FC<AppProps> = () => {
  const [, countryResponse] = useApi<CountryApi>(
    'https://coronavirus-tracker-api.herokuapp.com/v2/locations/225'
  )
  const [locationsRequest, locationsResponse] = useApi<LocationsApi>(
    'https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=US&source=csbs'
  )
  const [provinces, setProvinces] = useState<Province[] | undefined>()
  const [selectedProvince, setSelectedProvince] = useState<
    Province | undefined
  >()
  const [openDrawer, setOpenDrawer] = useState<boolean>(true)
  const [showTrendDialog, setShowTrendDialog] = useState(false)

  useEffect(() => {
    if (!locationsResponse) return

    const { locations } = locationsResponse.data

    const result = locations.reduce((acc: Province[], curr) => {
      if (curr.province === '') return acc
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

  const listItemClick = (item: Province) => {
    setSelectedProvince(item)
  }

  const handleDrawerOpen = () => setOpenDrawer(true)
  const handleDrawerClose = () => setOpenDrawer(false)

  return (
    <>
      <Header
        title="US Coronavirus (COVID-19) Visualization"
        handleDrawerOpen={handleDrawerOpen}
      >
        {countryResponse && (
          <HeaderStatistics data={countryResponse.data.location} />
        )}
        <Button color="inherit" onClick={() => setShowTrendDialog(true)}>
          Spread
        </Button>
      </Header>

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
                  <MapPopupStatistics data={loc} />
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
      {showTrendDialog && countryResponse && (
        <GrowthChart
          onClose={() => setShowTrendDialog(false)}
          data={countryResponse.data.location}
        />
      )}
    </>
  )
}

export type MapPopupStatisticsProps = {
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

export const MapPopupStatistics: FC<MapPopupStatisticsProps> = ({ data }) => {
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

type HeaderStatisticsProps = {
  data: Location
}
const HeaderStatistics: FC<HeaderStatisticsProps> = ({ data }) => {
  const styles = useStyles()

  return (
    <Box display={'flex'} textAlign={'center'}>
      <Box p={2} flex={'auto'}>
        <label className={styles.statLabel}>Total Confirmed (US)</label>
        <span className={styles.statValue} style={{ paddingLeft: '10px' }}>
          {data.latest.confirmed.toLocaleString()}
        </span>
      </Box>
      <Box p={2} flex={'auto'}>
        <label className={styles.statLabel}>Total Fatalities (US)</label>
        <span className={styles.statValue} style={{ paddingLeft: '10px' }}>
          {data.latest.deaths.toLocaleString()}
        </span>
      </Box>
    </Box>
  )
}
