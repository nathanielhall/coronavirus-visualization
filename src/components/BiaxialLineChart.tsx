import React, { FC } from 'react'
import { ChartContainer } from './ChartContainer'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  Legend,
  ReferenceLine,
  Brush
} from 'recharts'
import { format } from 'date-fns'

type BiaxialLineChartProps = {
  data: any
  yAxis?: string
}
export const BiaxialLineChart: FC<BiaxialLineChartProps> = ({
  data,
  yAxis = 'none'
}) => {
  return (
    <ChartContainer>
      <LineChart
        data={data}
        // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="days" />
        <YAxis yAxisId="left" />
        <Tooltip
          content={(props: any) => (
            <CustomTooltip
              payload={
                props.active && props.payload[0]
                  ? props.payload[0].payload
                  : undefined
              }
              label={yAxis}
              active={props.active}
            />
          )}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          name="Cases"
          dataKey="positiveIncrease"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          dot={false}
        />
        {yAxis !== 'none' && <YAxis yAxisId="right" orientation="right" />}
        <Line
          yAxisId="right"
          name={NameLookup[yAxis]}
          type="monotone"
          dataKey={yAxis}
          stroke="#82ca9d"
          dot={false}
        />

        <ReferenceLine y={0} yAxisId={'left'} stroke="#000" />
        <Brush dataKey={'days'} height={30} stroke="#8884d8" />
      </LineChart>
    </ChartContainer>
  )
}

type NameLookupType = { [index: string]: string }
const NameLookup: NameLookupType = {
  totalTestResultsIncrease: 'Tests',
  deathIncrease: 'Fatalities',
  hospitalizedIncrease: 'Hospitalizations',
  none: ''
}

type CustomTooltipProps = {
  payload: any
  label: string
  active: boolean
}
const CustomTooltip: FC<CustomTooltipProps> = ({ label, payload, active }) => {
  if (!active || !payload) return null

  const day: Date = payload.date

  const cases: number = payload.positiveIncrease
  const yAxisLabel = NameLookup[label]
  const yAxisValue: number = payload[label]

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
      <div>
        <strong>{format(day, 'MMMM d, yyyy')}</strong>
      </div>
      <div>Cases: {cases.toLocaleString()}</div>
      {!!yAxisValue && (
        <div>
          {yAxisLabel}: {yAxisValue.toLocaleString()}
        </div>
      )}
    </div>
  )
}
