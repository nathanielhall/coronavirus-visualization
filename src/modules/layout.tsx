import React, { FC, useState, useEffect } from 'react'
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
  CountryReport,
  DailyReport
} from './types'
import { getStateName } from './states'
// import { ProvinceStatistics } from './Statistics'
import { differenceInCalendarDays, parse } from 'date-fns'
import { LineChart } from 'components/LineChart'
// import { Statistics } from './Statistics'
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

export const Layout: FC = () => {
  const classes = useStyles()
  // const [getCounties, getCountiesResponse] = useApi<CountiesApi>(
  //   'https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=US&source=csbs'
  // )
  const [getStates, getStatesResponse] = useApi<StateReport[]>(
    'https://covidtracking.com/api/states'
  )

  const [getUSRequest, getUSResponse] = useApi<CountryReport[]>(
    'https://covidtracking.com/api/us'
  )
  const [USDailyRequest] = useApi<CountryDailyReport[]>()
  const [StatesDailyRequest] = useApi<StateDailyReport[]>()
  const [dailyReport, setDailyReport] = useState<DailyReport[]>()

  const [selectedState, setSelectedState] = useState<StateReport | undefined>()

  const listItemClick = (item: StateReport) => {
    setSelectedState(item)
  }

  useEffect(() => {
    const getStatesDaily = async (selected: string) => {
      StatesDailyRequest.get<StateDailyReport[]>(
        'https://covidtracking.com/api/states/daily'
      ).then((response) => {
        if (response.status === 200) {
          const data = response.data
            .filter((x) => x.state === selected)
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
          setDailyReport(report)
        }
      })
    }
    const getUSDaily = async () => {
      USDailyRequest.get<CountryDailyReport[]>(
        'https://covidtracking.com/api/us/daily'
      ).then((response) => {
        if (response.status === 200) {
          const report: DailyReport[] = response.data.reverse().map((item) => ({
            positive: item.positive,
            death: item.death,
            xAxis: differenceInCalendarDays(
              parse(item.date.toString(), 'yyyyMMdd', new Date()),
              new Date('03/04/2020')
            ),
            yAxis: item.positive
          }))

          setDailyReport(report)
        }
      })
    }

    if (!selectedState) getUSDaily()
    if (selectedState) getStatesDaily(selectedState.state)
  }, [selectedState])

  return (
    <>
      <main className={classes.content}>
        {dailyReport && (
          <LineChart data={dailyReport} xAxisKey="xAxis" yAxisKey="yAxis" />
        )}
      </main>
      <PermanentDrawer title={'Coronavirus Visualization'} width={drawerWidth}>
        <List>
          {!getUSRequest.loading && getUSResponse && (
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
