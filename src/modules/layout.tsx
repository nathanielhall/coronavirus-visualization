import React, { useState, FC } from 'react'
import { Grid, Container, Select, MenuItem } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Card, Panel } from './Statistics'
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
  const classes = useStyles()

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
        <Select
          disableUnderline
          className={classes.navigation}
          value={navSelection}
          onChange={(e) => setNavSelection(e.target.value as string)}
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
          {navigationOptions.map((s) => (
            <MenuItem key={s.key} value={s.key}>
              {s.value}
            </MenuItem>
          ))}
        </Select>
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

        <Select
          onChange={(e) => setSelectedDailyChart(e.target.value as string)}
          value={selectedDailyChart}
        >
          <MenuItem value="positiveIncrease">Cases</MenuItem>
          <MenuItem value="deathIncrease">Fatalities</MenuItem>
          <MenuItem value="totalTestResultsIncrease">Testing</MenuItem>
          <MenuItem value="hospitalizedIncrease">Hospitalized</MenuItem>
        </Select>

        <Grid container spacing={3}>
          <Grid item xs>
            <Panel title={''} loading={dailyReportLoading}>
              {!!dailyReport && (
                <DailyReportChart
                  data={dailyReport}
                  xAxis={'days'}
                  yAxis={selectedDailyChart}
                />
              )}
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
// type DailyChartProps = {
//   loading: boolean
//   title: string
//   data: DailyReport[] | undefined
//   xAxis: string
//   yAxis: string
// }
// const DailyChart: FC<DailyChartProps> = ({
//   loading,
//   title,
//   data,
//   xAxis,
//   yAxis
// }) => (
//   <Grid container spacing={3}>
//     <Grid item xs>
//       <Panel title={title} loading={loading}>
//         {!!data && <DailyReportChart data={data} xAxis={xAxis} yAxis={yAxis} />}
//       </Panel>
//     </Grid>
//   </Grid>
// )

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
      <Tooltip />
      <Bar dataKey={yAxis} fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
)
// type TotalCasesProps = {
//   data: DailyReport[]
// }
// const TotalCases: FC<TotalCasesProps> = ({ data }) => (
//   <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
//     <RCLineChart data={data}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="days" />
//       <YAxis />
//       <Tooltip />
//       <Line type="monotone" dataKey="positive" stroke="#8884d8" />
//     </RCLineChart>
//   </ResponsiveContainer>
// )
