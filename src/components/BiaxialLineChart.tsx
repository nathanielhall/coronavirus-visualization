import React, { FC } from 'react'
import { ChartContainer } from './ChartContainer'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  Legend
} from 'recharts'

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
        <Tooltip />
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
      </LineChart>
    </ChartContainer>
  )
}

type NameLookupType = { [index: string]: string }
const NameLookup: NameLookupType = {
  totalTestResultsIncrease: 'Tests',
  deathIncrease: 'Fatalities',
  hospitalizedIncrease: 'Hospitalizations'
}
