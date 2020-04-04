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
  handleDrawerOpen?: () => void
  children?: ReactNode
}
export const Header: FC<HeaderProps> = ({
  handleDrawerOpen,
  title,
  children
}) => {
  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        {handleDrawerOpen && (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  )
}
