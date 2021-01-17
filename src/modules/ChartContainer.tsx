import React, { FC } from 'react'
import { ResponsiveContainer } from 'recharts'

export const ChartContainer: FC<{ children: React.ReactNode }> = ({
  children
}) => (
  <ResponsiveContainer width={'100%'} aspect={4.0 / 1.25}>
    {children}
  </ResponsiveContainer>
)
