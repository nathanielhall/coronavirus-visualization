import React, { FC } from 'react'
import { TimelineValue } from '../types'
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'
import { LineChart } from 'components/LineChart'

const useStyles = makeStyles({
  dialogPaper: {
    minHeight: '90vh',
    maxHeight: '90vh'
  }
})

export type GrowthChartProps = {
  onClose: () => void
  data: TimelineValue[]
}
export const GrowthChart: FC<GrowthChartProps> = ({ onClose, data }) => {
  const classes = useStyles()

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
        <LineChart data={data} xAxisKey="key" yAxisKey="confirmed" />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
