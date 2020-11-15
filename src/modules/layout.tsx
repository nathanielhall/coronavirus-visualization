import React, { FC, useState, useEffect } from 'react'
import { PermanentDrawer } from 'components/Drawer'
import { List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Location, DailyReport, Report, NavListItem } from './types'
import { Statistics, MapPopupStatistics } from './Statistics'
import { Map, MapMarker } from 'components/Map'
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
import { useDataProvider } from './data-provider'
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
  const classes = useStyles()
  const [dailyReport, setDailyReport] = useState<DailyReport[] | undefined>()
  const [report, setReport] = useState<Report | undefined>()
  const [countiesReport, setCountiesReport] = useState<Location[] | undefined>()
  const [selectedNavItem, setSelectedNavItem] = useState<
    NavListItem | undefined
  >()
  const [toggle, setToggle] = useState<'map' | 'statistics'>('statistics')
  const onSelectionChange = (item: NavListItem) => {
    setSelectedNavItem(item)
  }

  const {
    loading,
    navItems,
    getReport,
    getDailyReport,
    getCounties
  } = useDataProvider()

  useEffect(() => {
    console.log(`loading: ${loading} hasNavItems: ${!!navItems}`)
    if (loading) return

    const item = !selectedNavItem && !!navItems ? navItems[0] : selectedNavItem
    if (!item) return

    console.log(`selected item: ${item.id}`)
    setReport(getReport(item))

    setDailyReport(getDailyReport(item))

    if (item.id !== 'US') {
      setCountiesReport(getCounties(item))
    }

    setSelectedNavItem(item)
  }, [selectedNavItem, loading])

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
