import React, { FC } from 'react'
import { LineChart } from 'components/LineChart'
import { DataProvider, Statistic } from '../Services'

export type GrowthChartProps = {
  dataProvider: DataProvider<Statistic>
}

export const GrowthChart: FC<GrowthChartProps> = ({
  dataProvider: [status, data, error]
}) => {
  if (status === 'idle' || status === 'pending') return <span>Loading...</span>
  if (status === 'rejected') return <span>{error || 'ERROR'}</span>
  if (!data) return null

  return (
    <LineChart
      data={data}
      xAxisKey="key"
      yAxisKey="confirmed"
      width={900}
      height={450}
    />
  )
}
