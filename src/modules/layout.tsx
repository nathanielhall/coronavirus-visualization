import React, { useState, FC } from 'react'
import { Grid, Container, Select, MenuItem } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Card, Panel, PanelBody, PanelTitle } from './Statistics'
import { states } from './states'
import { useReport, useTimelineReport } from './data-provider'
import { DailyReport } from './types'
import {
  // LineChart as RCLineChart,
  // Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  // Legend
  BarChart,
  Bar
} from 'recharts'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary
    },
    navigation: {
      marginBottom: '10px',
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    title: {
      fontSize: '11px',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginBottom: '4px'
    }
  })
)
export const Layout = () => {
  const defaultSelection = { key: 'US', value: 'Overall U.S' }
  const navigationOptions = [defaultSelection, ...states]
  const [navSelection, setNavSelection] = useState(defaultSelection.key)

  const [reportLoading, report] = useReport(navSelection)
  const [dailyReportLoading, dailyReport, recentReport] = useTimelineReport(
    navSelection
  )

  const [selectedDailyChart, setSelectedDailyChart] = useState(
    'positiveIncrease'
  )
  return (
    <div>
      {/* <Header title="COVID-19 Dashboard" /> */}
      <Container fixed>
        <Navigation
          value={navSelection}
          onChange={setNavSelection}
          options={navigationOptions}
        />
        <Grid container spacing={3}>
          <Grid item xs>
            <AsyncComponent loading={reportLoading}>
              {!!report ? (
                <Card
                  title="Total Cases"
                  primary={report.positive.toLocaleString()}
                />
              ) : null}
            </AsyncComponent>
          </Grid>
          <Grid item xs>
            <AsyncComponent loading={reportLoading}>
              {!!report ? (
                <Card
                  title="Total Fatalities"
                  primary={report.death.toLocaleString()}
                />
              ) : null}
            </AsyncComponent>
          </Grid>
          <Grid item xs>
            <AsyncComponent loading={dailyReportLoading}>
              {!!recentReport ? (
                <Card
                  title="Active Cases (last 2 weeks)"
                  primary={recentReport.positive.toLocaleString()}
                />
              ) : null}
            </AsyncComponent>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs>
            <Panel>
              <PanelTitle>
                <DailyChartDropdown
                  value={selectedDailyChart}
                  onChange={setSelectedDailyChart}
                />
              </PanelTitle>
              <PanelBody loading={dailyReportLoading}>
                {!!dailyReport && (
                  <DailyReportChart
                    data={dailyReport}
                    xAxis={'days'}
                    yAxis={selectedDailyChart}
                  />
                )}
              </PanelBody>
            </Panel>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs></Grid>
        </Grid>
      </Container>
    </div>
  )
}

type AsyncComponentProps = {
  children: React.ReactNode
  loading: boolean
}
const AsyncComponent: FC<AsyncComponentProps> = ({ children, loading }) => {
  if (loading) {
    return <Skeleton variant="rect" width="100%" height="100%" />
  }

  return <>{children}</>
}

type DailyReportChartProps = {
  data: DailyReport[]
  xAxis: string
  yAxis: string
}
const DailyReportChart: FC<DailyReportChartProps> = ({
  data,
  xAxis,
  yAxis
}) => (
  <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xAxis} />
      <YAxis />
      <Tooltip
      // content={(props: CustomTooltipProps) => <CustomTooltip {...props} />}
      />
      <Bar dataKey={yAxis} fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
)

// type CustomTooltipProps = {
//   type: string
//   payload: string
//   label: string
//   active: boolean
// }
// const CustomTooltip: FC<CustomTooltipProps> = ({
//   label,
//   payload,
//   type,
//   active
// }) => {
//   console.log(payload)
//   return (
//     <div>
//       <p>{label}</p>
//     </div>
//   )
//   // return <pre>{JSON.stringify({ label, payload, active, type }, null, 2)}</pre>
// }

type SelectDailyChartProps = {
  value: string
  onChange: (selection: string) => void
}
const DailyChartDropdown: FC<SelectDailyChartProps> = ({ value, onChange }) => (
  <Select
    disableUnderline
    MenuProps={{
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left'
      },
      getContentAnchorEl: null
    }}
    onChange={(e) => onChange(e.target.value as string)}
    value={value}
  >
    <MenuItem value="positiveIncrease">Daily Cases</MenuItem>
    <MenuItem value="deathIncrease">Daily Fatalities</MenuItem>
    <MenuItem value="totalTestResultsIncrease">Daily Testing</MenuItem>
    <MenuItem value="hospitalizedIncrease">Daily Hospitalized</MenuItem>
  </Select>
)

type NavigationProps = {
  options: Array<{ key: string; value: string }>
  value: string
  onChange: (opton: string) => void
  className?: string
}
const Navigation: FC<NavigationProps> = ({ options, value, onChange }) => {
  const classes = useStyles()
  return (
    <Select
      disableUnderline
      className={classes.navigation}
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left'
        },
        getContentAnchorEl: null
      }}
    >
      {options.map((s) => (
        <MenuItem key={s.key} value={s.key}>
          {s.value}
        </MenuItem>
      ))}
    </Select>
  )
}
