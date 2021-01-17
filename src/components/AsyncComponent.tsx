import React, { FC } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'

type AsyncComponentProps = {
  children: React.ReactNode
  loading: boolean
}
export const AsyncComponent: FC<AsyncComponentProps> = ({
  children,
  loading
}) => {
  if (loading) {
    return <Skeleton variant="rect" width="100%" height="100%" />
  }

  return <>{children}</>
}
