import React, { FC } from 'react'
import { ResponsiveContainer } from 'recharts'

export const ChartContainer: FC<{ children: React.ReactNode }> = ({
  children
}) => <ResponsiveContainer height={400}>{children}</ResponsiveContainer>
