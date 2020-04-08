import React, { FC, useState, useEffect } from 'react'
import { PermanentDrawer } from 'components/Drawer'
import { useApi } from 'src/api'
import { List, ListItem, ListItemText } from '@material-ui/core'
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
import { differenceInCalendarDays, parse } from 'date-fns'
import { LineChart } from 'components/LineChart'
import { Statistics, MapPopupStatistics } from './Statistics'
import { Map, MapMarker } from 'components/Map'

const drawerWidth = 350

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
    'https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=US&source=csbs'
  )
  const classes = useStyles()
  const [requestCountry, responseCountry] = useApi<CountryReport[]>(
    'https://covidtracking.com/api/v1/us/current.json'
  )
  const [requestCountryTimeline, responseCountryTimeline] = useApi<
    CountryDailyReport[]
  >('https://covidtracking.com/api/us/daily')
  const [requestStates, responseStates] = useApi<StateReport[]>(
    'https://covidtracking.com/api/states'
  )
  const [requestStatesTimeline, responseStatesTimeline] = useApi<
    StateDailyReport[]
  >('https://covidtracking.com/api/states/daily')

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

  const getStateReport = (selectedItem: string) => {
    if (!requestStates.loading && responseStates) {
      const item = responseStates.data.find((x) => x.state === selectedItem)
      if (!item) return
      console.log('set states report', 'LOG')
      setReport({
        title: getStateName(item.state),
        positive: item.positive,
        death: item.death,
        lastModified: item.lastUpdateEt
      })
    }
  }
  const getCountryReport = () => {
    if (!requestCountry.loading && responseCountry) {
      console.log('set country report', 'LOG')

      const { positive, death, lastModified } = responseCountry.data[0]
      setReport({
        title: 'United States',
        positive,
        death,
        lastModified
      })
    }
  }
  const getStateTimelineReport = (selectedItem: string) => {
    if (!requestStatesTimeline.loading && responseStatesTimeline) {
      const data = responseStatesTimeline.data
        .filter((x) => x.state === selectedItem)
        .reverse()

      const report: DailyReport[] = data.map((item) => ({
        positive: item.positive,
        death: item.death,
        yAxis: item.positive,
        xAxis: differenceInCalendarDays(
          parse(item.date.toString(), 'yyyyMMdd', new Date()),
          new Date('03/04/2020')
        )
      }))
      console.log('set states daily report', 'LOG')

      setDailyReport(report)
    }
  }
  const getCountryTimelineReport = () => {
    if (!requestCountryTimeline.loading && responseCountryTimeline) {
      const report: DailyReport[] = responseCountryTimeline.data.map(
        (item) => ({
          positive: item.positive,
          death: item.death,
          xAxis: differenceInCalendarDays(
            parse(item.date.toString(), 'yyyyMMdd', new Date()),
            new Date('03/04/2020') // FIXME:
          ),
          yAxis: item.positive
        })
      )

      setDailyReport(
        report.sort((a, b) => {
          if (a.xAxis < b.xAxis) return -1
          return 1
        })
      )
    }
  }

  const getCountiesToMap = () => {
    if (!getCounties.loading && getCountiesResponse && selectedNavItem) {
      const x = getCountiesResponse.data.locations.filter(
        (x) => x.province === getStateName(selectedNavItem.id)
      )
      setCountiesReport(x)
    }
  }

  useEffect(() => {
    //  generate report and daily report
    if (!selectedNavItem) return

    if (selectedNavItem.id === 'US') {
      getCountryReport()
      getCountryTimelineReport()
      setCountiesReport(undefined)
    } else {
      getStateReport(selectedNavItem.id)
      getStateTimelineReport(selectedNavItem.id)
      getCountiesToMap()
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
          <LineChart data={dailyReport} xAxisKey="xAxis" yAxisKey="yAxis" />
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
