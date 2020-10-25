import React, { FC, useState, useEffect } from 'react'
import { PermanentDrawer } from 'components/Drawer'
import { useApi } from 'src/api'
import { List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import {
  LocationsApi,
  Location,
  StateDailyReport,
  StateReport,
  CountryDailyReport,
  CountryReport,
  DailyReport,
  Report,
  NavListItem
} from './types'
import { getStateName } from './states'
// import { differenceInCalendarDays, parse } from 'date-fns'
import { Statistics, MapPopupStatistics } from './Statistics'
import { Map, MapMarker } from 'components/Map'
import {
  stateReportToReport,
  countryReportToReport,
  filterCountiesByState,
  countryTimelineToTimeline,
  stateTimelineToTimeline
} from './data-map'
import {
  LineChart as RCLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar
} from 'recharts'
const drawerWidth = 350

// type TreeMapType = {
//   name: string
//   children: { name: string; positive: number }[]
// }

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

export const Layout = () => {
  const [getCounties, getCountiesResponse] = useApi<LocationsApi>(
    'https://covid-tracker-us.herokuapp.com/v2/locations?country_code=US&source=csbs'
  )
  const classes = useStyles()
  const [requestCountry, responseCountry] = useApi<CountryReport[]>(
    'https://api.covidtracking.com/v1/us/current.json'
  )
  const [requestCountryTimeline, responseCountryTimeline] = useApi<
    CountryDailyReport[]
  >('https://api.covidtracking.com/v1/us/daily.json')
  const [requestStates, responseStates] = useApi<StateReport[]>(
    'https://api.covidtracking.com/v1/states/current.json'
  )
  const [requestStatesTimeline, responseStatesTimeline] = useApi<
    StateDailyReport[]
  >('https://api.covidtracking.com/v1/states/daily.json')

  const [dailyReport, setDailyReport] = useState<DailyReport[] | undefined>()
  const [report, setReport] = useState<Report | undefined>()
  const [countiesReport, setCountiesReport] = useState<Location[] | undefined>()
  const [navItems, setNavItems] = useState<NavListItem[] | undefined>()
  const [selectedNavItem, setSelectedNavItem] = useState<
    NavListItem | undefined
  >()
  const [toggle, setToggle] = useState<'map' | 'statistics'>('statistics')
  const onSelectionChange = (item: NavListItem) => {
    setSelectedNavItem(item)
  }

  // Navigation List Items
  useEffect(() => {
    if (requestStates.loading || !responseStates) return
    if (requestCountry.loading || !responseCountry) return

    const items: NavListItem[] = responseStates.data.map((item) => ({
      id: item.state,
      primary: `${item.state} - ${getStateName(item.state)}`,
      secondary: `Positive: ${item.positive.toLocaleString()} Fatalities: ${item.death.toLocaleString()}`
    }))

    console.log('set nav items', 'LOG')

    const USNavItem = {
      id: 'US',
      primary: 'United States',
      secondary: `Positive: ${responseCountry.data[0].positive.toLocaleString()} Fatalities: ${responseCountry.data[0].death.toLocaleString()}`
    }
    setNavItems([USNavItem, ...items])

    setSelectedNavItem(USNavItem)
  }, [responseStates, responseCountry])

  // switch out reporting data each time the nav item changes
  useEffect(() => {
    if (!selectedNavItem) return

    if (selectedNavItem.id === 'US') {
      if (!requestCountry.loading && responseCountry) {
        const result = countryReportToReport(responseCountry.data[0])
        setReport(result)
      }

      if (!requestCountryTimeline.loading && responseCountryTimeline) {
        const result = countryTimelineToTimeline(responseCountryTimeline.data)
        setDailyReport(result)
      }

      setCountiesReport(undefined)
    } else {
      if (!requestStates.loading && responseStates) {
        const result = stateReportToReport(
          responseStates.data,
          selectedNavItem.id
        )
        setReport(result)
      }
      if (!requestStatesTimeline.loading && responseStatesTimeline) {
        const result = stateTimelineToTimeline(
          responseStatesTimeline.data,
          selectedNavItem.id
        )
        setDailyReport(result)
      }

      if (!getCounties.loading && getCountiesResponse && selectedNavItem) {
        const result = filterCountiesByState(
          getCountiesResponse.data.locations,
          selectedNavItem.id
        )
        setCountiesReport(result)
      }
    }
  }, [selectedNavItem])

  return (
    <>
      <PermanentDrawer title={'Coronavirus Visualization'} width={drawerWidth}>
        {navItems && selectedNavItem && (
          <LocationList
            onChange={onSelectionChange}
            options={navItems}
            value={selectedNavItem}
          />
        )}
      </PermanentDrawer>
      <main className={classes.content}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={toggle}
          onChange={(event, value: 'map' | 'statistics') => setToggle(value)}
        >
          <ToggleButton value="statistics">Statistics</ToggleButton>
          <ToggleButton
            disabled={selectedNavItem && selectedNavItem.id === 'US'}
            value="map"
          >
            Map
          </ToggleButton>
        </ToggleButtonGroup>
        {report && toggle === 'statistics' && (
          <Statistics
            title={report.title}
            positive={report.positive}
            death={report.death}
            lastModified={report.lastModified}
          />
        )}
        {dailyReport && toggle === 'statistics' && (
          <>
            <Typography variant="h5">Total Cases</Typography>
            <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
              <RCLineChart data={dailyReport}>
                <Line type="monotone" dataKey={'positive'} stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey={'days'} />
                <Tooltip />
                <YAxis />
              </RCLineChart>
            </ResponsiveContainer>

            <Typography variant="h5">Daily Deaths</Typography>
            <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
              <RCLineChart data={dailyReport}>
                <Line type="monotone" dataKey={'death'} stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey={'days'} />
                <Tooltip />
                <YAxis />
              </RCLineChart>
            </ResponsiveContainer>

            <Typography variant="h5">Daily Cases</Typography>
            <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
              <BarChart data={dailyReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={'days'} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="growth" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
        {countiesReport && toggle === 'map' && countiesReport.length > 0 && (
          <Map
            center={[
              countiesReport[0].coordinates.latitude,
              countiesReport[0].coordinates.longitude
            ]}
            zoom={6}
          >
            {countiesReport.map((item) => (
              <MapMarker
                id={item.id}
                key={item.id}
                onClose={() => console.log('closed')}
                position={[
                  item.coordinates.latitude,
                  item.coordinates.longitude
                ]}
              >
                <MapPopupStatistics data={item} />
              </MapMarker>
            ))}
          </Map>
        )}
      </main>
    </>
  )
}

type LocationListProps = {
  onChange: (item: NavListItem) => void
  options: NavListItem[]
  value: NavListItem
}
export const LocationList: FC<LocationListProps> = ({
  onChange,
  options,
  value
}) => (
  <List>
    {options.map((item) => (
      <ListItem
        button
        selected={item.id === value.id}
        key={item.id}
        onClick={() => onChange(item)}
      >
        <ListItemText primary={item.primary} secondary={item.secondary} />
      </ListItem>
    ))}
  </List>
)
