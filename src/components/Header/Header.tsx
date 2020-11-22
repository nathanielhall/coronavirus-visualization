import React, { FC } from 'react'
import {
  makeStyles,
  createStyles,
  Theme,
  AppBar,
  Typography,
  Toolbar
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    colorPrimary: {
      backgroundColor: '#fff', //'#8884d8'
      color: '#000'
    }
  })
)

export type HeaderProps = {
  title: string
}
export const Header: FC<HeaderProps> = ({ title }) => {
  const classes = useStyles()

  return (
    <AppBar className={classes.colorPrimary} position="fixed">
      <Toolbar variant="dense">
        <Typography variant="h5" className={classes.title}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
