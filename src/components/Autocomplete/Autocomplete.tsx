import React, { ReactElement } from 'react'
import TextField from '@material-ui/core/TextField'
import MuiAutocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18
    }
  },
  input: {
    borderColor: '#fff',
    color: '#fff'
  }
})

export type AutocompleteProps<TData> = {
  name: string
  data: TData[]
  inputLabel: string
  getOptionLabel: (data: TData) => string
  renderOption: (data: TData) => JSX.Element
  testId?: string
  disableCloseOnSelect?: boolean
  //style?: React.CSSProperties;
}

export const Autocomplete: <TData>(
  props: AutocompleteProps<TData>
) => ReactElement<AutocompleteProps<TData>> = ({
  name,
  data,
  inputLabel,
  getOptionLabel,
  renderOption,
  disableCloseOnSelect = false,
  testId = 'autocomplete'
}) => {
  const classes = useStyles()

  return (
    <MuiAutocomplete
      style={{ width: 300 }}
      options={data}
      classes={{
        option: classes.option,
        input: classes.input
      }}
      disableCloseOnSelect={disableCloseOnSelect}
      autoHighlight
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      color="inherit"
      renderInput={(params) => (
        <TextField
          {...params}
          label={inputLabel}
          name={name}
          data-test-id={testId}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password' // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}
