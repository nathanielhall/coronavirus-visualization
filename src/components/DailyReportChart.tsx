import React, { FC } from 'react'
import { DailyReport } from '../types'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ReferenceLine,
  Brush
} from 'recharts'
import { ChartContainer } from './ChartContainer'
import { format } from 'date-fns'

type DailyReportChartProps = {
  data: DailyReport[]
  xAxis: string
  yAxis: string
}
export const DailyReportChart: FC<DailyReportChartProps> = ({
  data,
  xAxis,
  yAxis
}) => (
  <ChartContainer>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xAxis} />
      <YAxis />
      <Tooltip
        content={(props: any) => (
          <CustomTooltip
            payload={
              props.active && props.payload[0]
                ? props.payload[0].payload
                : undefined
            }
            label={props.label}
            active={props.active}
          />
        )}
      />
      <ReferenceLine y={0} stroke="#000" />
      <Brush dataKey={xAxis} height={30} stroke="#8884d8" />
      <Bar dataKey={yAxis} fill="#8884d8" />
    </BarChart>
  </ChartContainer>
)

type CustomTooltipProps = {
  payload: any
  label: string
  active: boolean
}
const CustomTooltip: FC<CustomTooltipProps> = ({ label, payload, active }) => {
  if (!active || !payload) return null

  const day: Date = payload.date
  const cases: number = payload.positiveIncrease

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '8px',
        border: '1px solid #000',
        width: '100%',
        height: '100%'
      }}
    >
      <div style={{ paddingBottom: '10px' }}>
        <div>Day</div>
        <div>{format(day, 'MM-dd-yyyy')}</div>
      </div>
      <div>
        <div>Cases</div>
        <div>{cases.toLocaleString()}</div>
      </div>
    </div>
  )
}
