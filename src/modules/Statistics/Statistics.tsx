import React, { FC } from 'react'
import { Typography, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
import { Location } from '../types'
import { format } from 'date-fns'

const useStyles = makeStyles({
  statLabel: {
    fontSize: 12,
    color: grey[500],
    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    margin: 0
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: '1px'
  }
})
type CountryStatisticsProps = {
  data: Location
}
export const CountryStatistics: FC<CountryStatisticsProps> = ({ data }) => {
  const styles = useStyles()

  return (
    <Box display={'flex'} textAlign={'center'}>
      <Box p={2} flex={'auto'}>
        <label className={styles.statLabel}>Total Confirmed (US)</label>
        <span className={styles.statValue} style={{ paddingLeft: '10px' }}>
          {data.latest.confirmed.toLocaleString()}
        </span>
      </Box>
      <Box p={2} flex={'auto'}>
        <label className={styles.statLabel}>Total Fatalities (US)</label>
        <span className={styles.statValue} style={{ paddingLeft: '10px' }}>
          {data.latest.deaths.toLocaleString()}
        </span>
      </Box>
    </Box>
  )
}

export type ProvinceStatisticsProps = {
  data: Location
}
export const ProvinceStatistics: FC<ProvinceStatisticsProps> = ({ data }) => {
  const styles = useStyles()
  return (
    <div>
      <Box>
        <Typography variant="h6">
          {`${data.province} -  ${data.county} County`}
        </Typography>
      </Box>
      <Box display={'flex'} textAlign={'center'}>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Confirmed</p>
          <p className={styles.statValue}>
            {data.latest.confirmed.toLocaleString()}
          </p>
        </Box>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Deaths</p>
          <p className={styles.statValue}>
            {data.latest.deaths.toLocaleString()}
          </p>
        </Box>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Recovered</p>
          <p className={styles.statValue}>
            {data.latest.recovered.toLocaleString()}
          </p>
        </Box>
      </Box>

      <p className={styles.statLabel}>
        {format(new Date(data.last_updated), 'MM/dd/yyyy hh:mm')}
      </p>
    </div>
  )
}
