import React, { useState, FC } from 'react'
import { Grid, Container, Select, MenuItem } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Card, Panel, PanelBody, PanelTitle } from './Statistics'
import { states } from './states'
import { useReport, useTimelineReport } from './data-provider'
// import { DailyReport } from './types'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  // Legend
  // BarChart,
  // Bar,
  Line,
  LineChart,
  Legend
  // Treemap as RCTreemap
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

  const [selectedDailyChart, setSelectedDailyChart] = useState('none')
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
                <>
                  <div style={{ display: 'inline' }}>Total Cases</div>

                  <div>
                    Right Y-Axis &nbsp;
                    <DailyChartDropdown
                      value={selectedDailyChart}
                      onChange={setSelectedDailyChart}
                    />
                  </div>
                </>
              </PanelTitle>
              <PanelBody loading={dailyReportLoading}>
                {!!dailyReport && (
                  <>
                    {/* <DailyReportChart
                      data={dailyReport}
                      xAxis={'days'}
                      yAxis={selectedDailyChart}
                    /> */}
                    <BiaxialLineChart
                      data={dailyReport}
                      yAxis={selectedDailyChart}
                    />
                  </>
                )}
              </PanelBody>
            </Panel>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

const ChartContainer: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
    {children}
  </ResponsiveContainer>
)

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

// type DailyReportChartProps = {
//   data: DailyReport[]
//   xAxis: string
//   yAxis: string
// }
// const DailyReportChart: FC<DailyReportChartProps> = ({
//   data,
//   xAxis,
//   yAxis
// }) => (
//   <ChartContainer>
//     <BarChart data={data}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey={xAxis} />
//       <YAxis />
//       <Tooltip
//         content={(props: any) => (
//           <CustomTooltip
//             payload={props.active ? props.payload[0].payload : undefined}
//             label={props.label}
//             active={props.active}
//           />
//         )}
//         //content={<CustomTooltip />}
//       />
//       <Bar dataKey={yAxis} fill="#8884d8" />
//     </BarChart>
//   </ChartContainer>
// )

// type CustomTooltipProps = {
//   payload: any
//   label: string
//   active: boolean
// }

// const CustomTooltip: FC<CustomTooltipProps> = ({ label, payload, active }) => {
//   if (!active || !payload) return null

//   return (
//     <div
//       style={{
//         backgroundColor: '#fff',
//         padding: '8px',
//         border: '1px solid #000'
//       }}
//     >
//       <dl>
//         <dt>Day</dt>
//         <dd>{label}</dd>
//         <dt>Cases</dt>
//         <dd>{payload.positiveIncrease}</dd>
//         <dt>Deaths</dt>
//         <dd>{payload.deathIncrease}</dd>
//       </dl>
//     </div>
//   )
//   // return <pre>{JSON.stringify({ label, payload, active, type }, null, 2)}</pre>
// }

type BiaxialLineChartProps = {
  data: any
  yAxis?: string
}
const BiaxialLineChart: FC<BiaxialLineChartProps> = ({
  data,
  yAxis = 'none'
}) => {
  return (
    <ChartContainer>
      <LineChart
        data={data}
        // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="days" />
        <YAxis yAxisId="left" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="positiveIncrease"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          dot={false}
        />
        <YAxis yAxisId="right" orientation="right" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey={yAxis}
          stroke="#82ca9d"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

// type TreemapProps = {
//   data: any
// }

// const Treemap: FC<TreemapProps> = ({ data }) => {
//   return (
//     <ChartContainer>
//       <RCTreemap
//         data={data}
//         dataKey="positive"
//         // ratio={(4 / 3) as number}
//         stroke="#fff"
//         fill="#8884d8"
//       />
//     </ChartContainer>
//   )
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
    <MenuItem value="none">None</MenuItem>
    <MenuItem value="deathIncrease">Fatalities</MenuItem>
    <MenuItem value="totalTestResultsIncrease">Testing</MenuItem>
    <MenuItem value="hospitalizedIncrease">Hospitalized</MenuItem>
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
