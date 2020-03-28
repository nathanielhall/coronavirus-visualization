import React, { FC, ReactNode } from 'react'
import MuiDrawer from '@material-ui/core/Drawer'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { Typography } from '@material-ui/core'
// TODO: Determine if possible to use props here
const drawerWidth = 425

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3)
    }
  })
)

type PermanentDrawerProps = {
  children: ReactNode
  title?: string
}
export const PermanentDrawer: FC<PermanentDrawerProps> = ({
  children,
  title
}) => {
  const classes = useStyles()

  return (
    <MuiDrawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
      anchor="left"
    >
      <div className={classes.toolbar}>
        <Typography
          style={{ paddingLeft: '10px', paddingTop: '15px' }}
          variant="h6"
        >
          {title || ''}
        </Typography>
      </div>

      <Divider />
      {children}
    </MuiDrawer>
  )
}
