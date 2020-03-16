import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { App, AppProps } from './app'

const setup = (propOverrides?: Partial<AppProps>) => {
  const props = {
    // define props here
    ...propOverrides
  }
  const wrapper: ReactWrapper = mount(<App {...props} />)
  return {
    props,
    wrapper
  }
}

test('<App />', () => {
  const { wrapper } = setup()
  expect(wrapper.exists()).toBeTruthy()
})

test.todo('more tests')
