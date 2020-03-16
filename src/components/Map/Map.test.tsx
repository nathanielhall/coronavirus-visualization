import React from 'react'
import { mount } from 'enzyme'
import { Map, MapProps, MapMarker } from './Map'

type TestData = {
  id: number
  name: string
  latitiude: number
  longitude: number
}
const testData: TestData[] = [
  {
    id: 1,
    name: 'Aachen',
    latitiude: 50.775,
    longitude: 6.08333
  },
  {
    id: 2,
    name: 'Aarhus',
    latitiude: 56.18333,
    longitude: 10.23333
  },
  {
    id: 6,
    name: 'Abee',
    latitiude: 54.21667,
    longitude: -113.0
  },
  {
    id: 10,
    name: 'Acapulco',
    latitiude: 16.88333,
    longitude: -99.9
  },
  {
    id: 456,
    name: 'Achiras',
    latitiude: -33.16667,
    longitude: -64.95
  }
]

const setup = (propOverrides?: Partial<MapProps>) => {
  const props = {
    ...propOverrides
  }
  const wrapper = mount(
    <Map {...props}>
      {testData.map((impact) => (
        <MapMarker
          id={impact.id}
          key={impact.id}
          onClose={jest.fn()}
          position={[impact.latitiude, impact.longitude]}
        >
          <span>Form goes here</span>
        </MapMarker>
      ))}
    </Map>
  )
  return {
    props,
    wrapper
  }
}

test('<Map /> renders', () => {
  const { wrapper } = setup()
  expect(wrapper.exists()).toBeTruthy()
})

describe('<Map /> markers', () => {
  const { wrapper } = setup()
  it.each(testData)('exist for each location', ({ id }) => {
    expect(wrapper.find(`[data-test-id="marker_${id}"]`).exists()).toBeTruthy()
  })
})
