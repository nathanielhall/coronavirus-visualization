import React, { FC, ReactNode } from 'react'
import MuiDrawer from '@material-ui/core/Drawer'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { Typography } from '@material-ui/core'

type PermanentDrawerProps = {
  children: ReactNode
  title?: string
  width?: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    appBar: {
      width: (props: PermanentDrawerProps) =>
        `calc(100% - ${props.width || 425}px)`,
      marginLeft: (props: PermanentDrawerProps) => props.width || 425
    },
    drawer: {
      width: (props: PermanentDrawerProps) => props.width || 425,
      flexShrink: 0
    },
    drawerPaper: {
      width: (props: PermanentDrawerProps) => props.width || 425
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3)
    }
  })
)

export const PermanentDrawer: FC<PermanentDrawerProps> = (props) => {
  const classes = useStyles(props)

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
          {props.title || ''}
        </Typography>
      </div>

      <Divider />
      {props.children}
    </MuiDrawer>
  )
}
