import React, { FC } from 'react'
import { LineChart } from 'components/LineChart'
import { TimelineDataProvider } from '../Services'

export type GrowthChartProps = {}
export const GrowthChart: FC<GrowthChartProps> = () => {
  const [status, data, error] = TimelineDataProvider()

  if (status === 'idle' || status === 'pending') return <span>Loading...</span>
  if (status === 'rejected') return <span>{error || 'ERROR'}</span>
  if (!data) return null

  return <LineChart data={data} xAxisKey="key" yAxisKey="confirmed" />
}
