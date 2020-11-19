import React, { FC } from 'react'
import { Card as MuiCard, Typography, CardContent } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
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
export const Card: FC<CardProps> = ({ title, primary, secondary = '' }) => {
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
