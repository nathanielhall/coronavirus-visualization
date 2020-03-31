import React, { FC, useEffect, useState } from 'react'
import { Location, TimelineValue } from '../types'
import {
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

export const GrowthChart: FC<GrowthChartProps> = ({ onClose, data }) => {
  const [statistics, setStatistics] = useState<TimelineValue[]>([])

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
    <Dialog open>
      <DialogContent>
        <DialogContentText>
          Coronavirus (COVID-19) spread over time
        </DialogContentText>
        <LineChart
          data={statistics}
          xAxisKey="key"
          yAxisKey="confirmed"
          width={400}
          height={225}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
