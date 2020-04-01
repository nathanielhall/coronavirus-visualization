import React, { FC, useEffect, useState } from 'react'
import { Location, TimelineValue } from '../types'
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'
import { format } from 'date-fns'
import { LineChart } from 'components/LineChart'
export type GrowthChartProps = {
  onClose: () => void
  data: Location
}

const useStyles = makeStyles({
  dialogPaper: {
    minHeight: '90vh',
    maxHeight: '90vh'
  }
})

export const GrowthChart: FC<GrowthChartProps> = ({ onClose, data }) => {
  const [statistics, setStatistics] = useState<TimelineValue[]>([])

  const classes = useStyles()

  useEffect(() => {
    const {
      timelines: {
        confirmed: { timeline }
      }
    } = data

    if (!timeline) return

    const confirmedCases: TimelineValue[] = Object.entries(timeline).map(
      ([key, value]) => ({
        key: format(new Date(key), 'MM-dd'),
        confirmed: value,
        type: 'confirmed'
      })
    )

    setStatistics(confirmedCases)
  }, [])
  return (
    <Dialog
      open
      maxWidth="lg"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogContent>
        <DialogContentText>
          Coronavirus (COVID-19) spread over time in US
        </DialogContentText>
        <LineChart data={statistics} xAxisKey="key" yAxisKey="confirmed" />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
