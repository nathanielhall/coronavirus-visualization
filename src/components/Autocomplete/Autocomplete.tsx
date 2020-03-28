import React, { ReactElement, ChangeEvent } from 'react'
import TextField from '@material-ui/core/TextField'
import MuiAutocomplete from '@material-ui/lab/Autocomplete'

export type AutocompleteProps<TData> = {
  name: string
  data: TData[]
  inputLabel: string
  getOptionLabel: (data: TData) => string
  renderOption: (data: TData) => JSX.Element
  testId?: string
  disableCloseOnSelect?: boolean
  value: TData | null
  onChange: (event: ChangeEvent<{}>, value: TData | null) => void
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
  testId = 'autocomplete',
  value,
  onChange
}) => {
  return (
    <MuiAutocomplete
      style={{ width: 300 }}
      options={data}
      size="small"
      disableCloseOnSelect={disableCloseOnSelect}
      autoHighlight
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={inputLabel}
          name={name}
          data-test-id={testId}
          variant="standard"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password' // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}
