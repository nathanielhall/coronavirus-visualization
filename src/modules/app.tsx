import React, { FC, useState, useEffect } from 'react'
import { Map, MapMarker } from 'components/Map'

import { PermanentDrawer } from 'components/Drawer'
import { GrowthChart } from './GrowthChart'
import { useApi } from 'src/api'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { CountryApi, LocationsApi, Province, TimelineValue } from './types'
import { CountyStatistics } from './Statistics'
import { format } from 'date-fns'

const drawerWidth = 425

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1),
      marginLeft: `${drawerWidth}px`
    }
  })
)

export type AppProps = {}
export const App: FC<AppProps> = () => {
  const classes = useStyles()

  //  https://covidtracking.com/api/v1/states/daily.json

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
  const [showTrendDialog, setShowTrendDialog] = useState(false)

  const [countryTimeline, setCountryTimeline] = useState<TimelineValue[]>([])

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

  useEffect(() => {
    if (!countryResponse) return
    const {
      timelines: {
        confirmed: { timeline }
      }
    } = countryResponse.data.location

    if (!timeline) return

    const confirmedCases: TimelineValue[] = Object.entries(timeline).map(
      ([key, value]) => ({
        key: format(new Date(key), 'MM-dd'),
        confirmed: value,
        type: 'confirmed'
      })
    )

    setCountryTimeline(confirmedCases)
  }, [countryResponse])

  const listItemClick = (item: Province) => {
    setSelectedProvince(item)
  }

  return (
    <>
      <main className={classes.content}>
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
                  <CountyStatistics data={loc} />
                </MapMarker>
              ))}
        </Map>
      </main>

      <PermanentDrawer title={'Coronavirus Visualization'} width={drawerWidth}>
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
                  primary={`${
                    item.name
                  } (${item.latest.confirmed.toLocaleString()})`}
                  secondary={`Deaths: ${item.latest.deaths} Recovered: ${item.latest.recovered}`}
                />
              </ListItem>
            ))}
        </List>
      </PermanentDrawer>

      {showTrendDialog && countryResponse && (
        <GrowthChart
          onClose={() => setShowTrendDialog(false)}
          data={countryTimeline}
        />
      )}
    </>
  )
}
