import React, { FC } from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary
    },
    navigation: {
      marginBottom: '10px',
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    title: {
      fontSize: '11px',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginBottom: '4px'
    }
  })
)
type NavigationProps = {
  options: Array<{ key: string; value: string }>
  value: string
  onChange: (opton: string) => void
  className?: string
}
export const Navigation: FC<NavigationProps> = ({
  options,
  value,
  onChange
}) => {
  const classes = useStyles()
  return (
    <Select
      disableUnderline
      className={classes.navigation}
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left'
        },
        getContentAnchorEl: null
      }}
    >
      {options.map((s) => (
        <MenuItem key={s.key} value={s.key}>
          {s.value}
        </MenuItem>
      ))}
    </Select>
  )
}
