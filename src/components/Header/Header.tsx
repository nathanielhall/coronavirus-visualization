import React, { ReactNode, FC } from 'react'
import {
  makeStyles,
  createStyles,
  Theme,
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

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
    }
  })
)

export type HeaderProps = {
  title: string
  children?: ReactNode
}
export const Header: FC<HeaderProps> = ({ title, children }) => {
  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  )
}
