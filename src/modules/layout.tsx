import React, { FC, useState } from 'react'
//import { Map, MapMarker } from 'components/Map'
import { PermanentDrawer } from 'components/Drawer'
// import { GrowthChart } from './GrowthChart'
import { useApi } from 'src/api'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import {
  // CountiesApi,
  StateDailyReport,
  StateReport,
  CountryDailyReport,
  CountryReport
} from './types'
import { getStateName } from './states'
// import { ProvinceStatistics } from './Statistics'
// import { format } from 'date-fns'
import { LineChart } from 'components/LineChart'

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

export const Layout: FC = () => {
  const classes = useStyles()
  // const [getCounties, getCountiesResponse] = useApi<CountiesApi>(
  //   'https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=US&source=csbs'
  // )
  const [getStates, getStatesResponse] = useApi<StateReport[]>(
    'https://covidtracking.com/api/states'
  )
  const [getStatesDaily, getStatesDailyResponse] = useApi<StateDailyReport[]>(
    'https://covidtracking.com/api/states/daily'
  )
  const [, getUSResponse] = useApi<CountryReport[]>(
    'https://covidtracking.com/api/us'
  )
  const [getUSDaily, getUSDailyResponse] = useApi<CountryDailyReport[]>(
    'https://covidtracking.com/api/us/daily'
  )
  const [selectedState, setSelectedState] = useState<StateReport | undefined>()

  const listItemClick = (item: StateReport) => {
    setSelectedState(item)
  }

  return (
    <>
      <main className={classes.content}>
        {!getUSDaily.loading && getUSDailyResponse && (
          <LineChart
            data={getUSDailyResponse.data.reverse()}
            xAxisKey="date"
            yAxisKey="positive"
          />
        )}
        {selectedState && !getStatesDaily.loading && getStatesDailyResponse && (
          <LineChart
            data={getStatesDailyResponse.data
              .filter((x) => x.state === selectedState.state)
              .reverse()}
            xAxisKey="date"
            yAxisKey="positive"
          />
        )}
        {/* {getStatesDailyResponse && (
          <pre>TEST{JSON.stringify(getStatesDailyResponse.data, null, 2)}</pre>
        )} */}
      </main>
      <PermanentDrawer title={'Coronavirus Visualization'} width={drawerWidth}>
        <List>
          {getUSResponse && getUSResponse.data && (
            <ListItem
              button
              selected={!selectedState}
              key={100}
              onClick={() => setSelectedState(undefined)}
            >
              <ListItemText
                primary={'United States'}
                secondary={`Positive: ${getUSResponse.data[0].positive.toLocaleString()} Fatalities: ${getUSResponse.data[0].death.toLocaleString()}`}
              />
            </ListItem>
          )}
          {!getStates.loading &&
            getStatesResponse &&
            getStatesResponse.data.map((item, index) => (
              <ListItem
                button
                selected={selectedState && item.state === selectedState.state}
                key={index}
                onClick={() => listItemClick(item)}
              >
                <ListItemText
                  primary={`${item.state} - ${getStateName(item.state)}`}
                  secondary={`Positive: ${item.positive.toLocaleString()} Fatalities: ${item.death.toLocaleString()}`}
                />
              </ListItem>
            ))}
        </List>
      </PermanentDrawer>
    </>
  )
}
