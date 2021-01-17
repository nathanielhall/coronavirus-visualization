import React, { FC } from 'react'
import { Select, MenuItem } from '@material-ui/core'

type SelectDailyChartProps = {
  value: string
  onChange: (selection: string) => void
}
export const DailyChartDropdown: FC<SelectDailyChartProps> = ({
  value,
  onChange
}) => (
  <Select
    disableUnderline
    MenuProps={{
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left'
      },
      getContentAnchorEl: null
    }}
    onChange={(e) => onChange(e.target.value as string)}
    value={value}
  >
    <MenuItem value="none">None</MenuItem>
    <MenuItem value="deathIncrease">Fatalities</MenuItem>
    <MenuItem value="totalTestResultsIncrease">Testing</MenuItem>
    <MenuItem value="hospitalizedIncrease">Hospitalized</MenuItem>
  </Select>
)
