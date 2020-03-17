import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { Autocomplete, AutocompleteProps } from './Autocomplete'

type CountryType = {
  code: string
  label: string
  phone: string
}

const countries: CountryType[] = [
  { code: 'AD', label: 'Andorra', phone: '376' },
  { code: 'AE', label: 'United Arab Emirates', phone: '971' },
  { code: 'AF', label: 'Afghanistan', phone: '93' },
  { code: 'AG', label: 'Antigua and Barbuda', phone: '1-268' },
  { code: 'AI', label: 'Anguilla', phone: '1-264' },
  { code: 'AL', label: 'Albania', phone: '355' },
  { code: 'AM', label: 'Armenia', phone: '374' },
  { code: 'AO', label: 'Angola', phone: '244' },
  { code: 'AQ', label: 'Antarctica', phone: '672' }
]

const setup = (propOverrides?: Partial<AutocompleteProps<CountryType>>) => {
  const props: AutocompleteProps<CountryType> = {
    name: 'autocomplete',
    data: countries,
    inputLabel: 'select a country',
    getOptionLabel: (option) => option.label,
    // eslint-disable-next-line react/display-name
    renderOption: (option) => (
      <>
        <span>{option.code}</span>
        {option.label} ({option.code}) +{option.phone}
      </>
    ),
    value: null,
    onChange: jest.fn(),
    testId: 'autocomplete123',
    ...propOverrides
  }
  const wrapper: ReactWrapper = mount(<Autocomplete {...props} />)
  return {
    props,
    wrapper
  }
}

test('<Autocomplete />', () => {
  const { wrapper } = setup()
  expect(wrapper.exists()).toBeTruthy()
})

test.todo('more tests')
