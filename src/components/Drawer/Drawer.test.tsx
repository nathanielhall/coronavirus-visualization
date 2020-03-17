import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { Drawer, DrawerProps } from './Drawer'

const setup = (propOverrides?: Partial<DrawerProps>) => {
  const props = {
    // define props here
    handleDrawerClose: jest.fn(),
    open: true,
    ...propOverrides
  }
  const wrapper: ReactWrapper = mount(<Drawer {...props} />)
  return {
    props,
    wrapper
  }
}

test('<Drawer />', () => {
  const { wrapper } = setup()
  expect(wrapper.exists()).toBeTruthy()
})

test.todo('more tests')
