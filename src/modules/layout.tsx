import React, { useState, FC } from 'react'
import {
  Grid,
  Paper,
  Container,
  Select,
  MenuItem
  // Typography
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Card } from './Statistics'
import { states } from './states'
import { useReport, useTimelineReport } from './data-provider'
import { DailyReport } from './types'
import {
  LineChart as RCLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
  // BarChart,
  // Bar
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
    }
  })
)
export const Layout = () => {
  const classes = useStyles()

  const navigationOptions = [{ key: 'US', value: 'Overall U.S' }, ...states]
  const [defaultSelection] = navigationOptions
  const [navSelection, setNavSelection] = useState(defaultSelection.key)

  const [reportLoading, report] = useReport(navSelection)
  const [dailyReportLoading, dailyReport] = useTimelineReport(navSelection)

  return (
    <div>
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
            <MenuItem value={s.key}>{s.value}</MenuItem>
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
            <Card title="Total Fatalities" primary="200,000" />
          </Grid>
          <Grid item xs>
            <Card title="Active" primary="12,000" secondary="last two weeks" />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs>
            <AsyncComponent loading={dailyReportLoading}>
              {!!dailyReport && <TotalCases data={dailyReport} />}
            </AsyncComponent>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}>xs</Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}>xs</Paper>
          </Grid>
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

type TotalCasesProps = {
  data: DailyReport[]
}
const TotalCases: FC<TotalCasesProps> = ({ data }) => (
  <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
    <RCLineChart data={data}>
      <Line type="monotone" dataKey={'positive'} stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey={'days'} />
      <Tooltip />
      <YAxis />
    </RCLineChart>
  </ResponsiveContainer>
)
