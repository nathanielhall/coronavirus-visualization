import React, { useState } from 'react'
import { Grid, Container } from '@material-ui/core'
import { Card, Panel, PanelBody, PanelTitle } from '../components/Card'
import { states } from './states'
import { useReport, useTimelineReport } from './data-provider'
import { AsyncComponent } from '../components/AsyncComponent'
import { DailyReportChart } from '../components/DailyReportChart'
import { Navigation } from '../components/Navigation'
import { DailyCasesLineChart } from '../components/DailyCasesLineChart'

export const Dashboard = () => {
  const defaultSelection = { key: 'US', value: 'Overall U.S' }
  const navigationOptions = [defaultSelection, ...states]
  const [navSelection, setNavSelection] = useState(defaultSelection.key)

  const [reportLoading, report] = useReport(navSelection)
  const [dailyReportLoading, dailyReport, recentReport] = useTimelineReport(
    navSelection
  )

  console.log('Dashboard rendering')

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
                <div style={{ display: 'inline' }}>Daily Cases: Bar Chart</div>
              </PanelTitle>
              <PanelBody loading={dailyReportLoading}>
                {!!dailyReport && (
                  <>
                    <DailyReportChart
                      data={dailyReport}
                      xAxis={'days'}
                      yAxis={'positiveIncrease'}
                    />
                  </>
                )}
              </PanelBody>
            </Panel>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs>
            <DailyCasesLineChart
              loading={dailyReportLoading}
              data={dailyReport}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
