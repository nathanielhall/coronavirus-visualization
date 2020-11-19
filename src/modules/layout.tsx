import React, { useState } from 'react'
import { Grid, Paper, Container, Select, MenuItem } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Card } from './Statistics'
import { states } from './states'

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

  // const [reportLoading, report] = useReport(selection)
  // const [timelineReportLoading, getTimelineReport] = useState(selection)
  // const [countiesReportLoading, getCountiesReport] = useState(selection)
  const navigationOptions = [{ key: 'US', value: 'Overall U.S' }, ...states]
  const [defaultSelection] = navigationOptions
  const [navSelection, setNavSelection] = useState(defaultSelection.key)

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
            <Card title="Total Cases" primary="4.5M" />
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
            <Paper className={classes.paper}>xs</Paper>
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
