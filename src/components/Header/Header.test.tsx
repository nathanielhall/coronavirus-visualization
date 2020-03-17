import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { Header, HeaderProps } from './Header'

const setup = (propOverrides?: Partial<HeaderProps>) => {
  const props = {
    title: 'header title here',
    handleDrawerOpen: jest.fn(),
    ...propOverrides
  }
  const wrapper: ReactWrapper = mount(
    <Header {...props}>
      <span>Header Child</span>
    </Header>
  )
  return {
    props,
    wrapper
  }
}

test('<Header />', () => {
  const { wrapper } = setup()
  expect(wrapper.exists()).toBeTruthy()
})

test('header title displays', () => {
  const { wrapper, props } = setup()

  expect(wrapper.find('h6').contains(props.title)).toBeTruthy()
})

test.todo('header contains child component')
test.todo('header has icon button')
