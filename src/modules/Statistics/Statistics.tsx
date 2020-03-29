import React, { FC } from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { grey } from '@material-ui/core/colors'

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

export type StatisticsProps = {
  title?: string
  confirmed: number
  deaths: number
  recovered: number
}

export const Statistics: FC<StatisticsProps> = ({
  title,
  confirmed,
  deaths,
  recovered
}) => {
  const styles = useStyles()

  return (
    <>
      {title && <Typography variant="h6">{title}</Typography>}
      <Box display={'flex'} textAlign={'center'}>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Confirmed</p>
          <p className={styles.statValue}>{confirmed.toLocaleString()}</p>
        </Box>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Deaths</p>
          <p className={styles.statValue}>{deaths.toLocaleString()}</p>
        </Box>
        <Box p={2} flex={'auto'}>
          <p className={styles.statLabel}>Recovered</p>
          <p className={styles.statValue}>{recovered.toLocaleString()}</p>
        </Box>
      </Box>
    </>
  )
}
