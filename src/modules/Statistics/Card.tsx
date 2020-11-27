import React, { FC } from 'react'
import { Card as MuiCard, Typography, CardContent } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    panelheader: {
      borderRadius: '4px 4px 0px 0px',
      borderBottom: '0px',
      padding: '8px 8px 4px 8px'
    },
    panelbody: {
      borderRadius: '0px 0px 4px 4px'
    },
    title: {
      fontSize: '11px',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginBottom: '4px'
    }
  })
)

type CardProps = {
  title: string
  primary: string
  secondary?: string
}
export const Card: FC<CardProps> = ({ title, primary, secondary }) => {
  const classes = useStyles()

  return (
    <MuiCard className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
        <Typography variant="h5">{primary}</Typography>
      </CardContent>
    </MuiCard>
  )
}

type PanelProps = {
  children: React.ReactNode
}
export const Panel: FC<PanelProps> = ({ children }) => {
  const classes = useStyles()
  return <div className={classes.root}>{children}</div>
}

type PanelBodyProps = {
  children: React.ReactNode
  loading: boolean
}
export const PanelBody: FC<PanelBodyProps> = ({ children, loading }) => {
  const classes = useStyles()
  return (
    <MuiCard className={classes.panelbody} variant="outlined">
      <CardContent>
        {loading ? (
          <Skeleton variant="rect" width="100%" height="400px" />
        ) : (
          children
        )}
      </CardContent>
    </MuiCard>
  )
}

type PanelTitleProps = {
  children: React.ReactNode
  title?: string
}
export const PanelTitle: FC<PanelTitleProps> = ({ children, title }) => {
  const classes = useStyles()
  return (
    <MuiCard className={classes.panelheader} variant="outlined">
      {title && (
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
      )}
      {children}
    </MuiCard>
  )
}
