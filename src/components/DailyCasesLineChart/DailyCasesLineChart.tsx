import React, { useState, FC } from 'react'
import { BiaxialLineChart } from '../BiaxialLineChart'
import { DailyChartDropdown } from './DailyChartDropdown'
import { DailyReport } from 'src/types'
import { Panel, PanelTitle, PanelBody } from '../Card'

type DailyCasesLineChartProps = {
  loading: boolean
  data: DailyReport[] | undefined
}
export const DailyCasesLineChart: FC<DailyCasesLineChartProps> = ({
  loading,
  data
}) => {
  const [selectedDailyChart, setSelectedDailyChart] = useState('deathIncrease')

  return (
    <Panel>
      <PanelTitle>
        <>
          <div style={{ display: 'inline' }}>Daily Cases: Line Chart</div>

          <div style={{ float: 'right' }}>
            Right Y-Axis &nbsp;
            <DailyChartDropdown
              value={selectedDailyChart}
              onChange={setSelectedDailyChart}
            />
          </div>
        </>
      </PanelTitle>
      <PanelBody loading={loading}>
        {!!data && (
          <>
            <BiaxialLineChart data={data} yAxis={selectedDailyChart} />
          </>
        )}
      </PanelBody>
    </Panel>
  )
}
