import React, { FC } from 'react'
import { Map, MapMarker } from 'components/Map'
import { useApi } from 'src/api'

export type AppProps = {}
export const App: FC<AppProps> = () => {
  type ConfirmedType = {
    provinceState: string
    countryRegion: string
    lastUpdate: number
    lat: number
    long: number
    confirmed: number
    recovered: number
    deaths: number
    active: number
  }

  const [request, response] = useApi<ConfirmedType[]>(
    'https://covid19.mathdro.id/api/countries/US/confirmed'
  )

  return (
    <React.Fragment>
      <main>
        {request.loading && <span>Loading...</span>}
        {request.error && <div>Error!</div>}
        {response && (
          <Map center={[40.4, -95.7]} zoom={5}>
            {response.data.map((confirmed, index) => (
              <MapMarker
                id={index}
                key={index}
                onClose={() => console.log('closed')}
                position={[confirmed.lat, confirmed.long]}
              >
                <div>
                  <div>
                    <span>
                      <b>{confirmed.provinceState}</b>
                    </span>
                  </div>
                  <div>
                    <label>Confirmed</label>&nbsp;
                    <span>{confirmed.confirmed}</span>
                  </div>
                  <div>
                    <label>Deaths</label>&nbsp;
                    <span>{confirmed.deaths}</span>
                  </div>
                  <div>
                    <label>Recovered</label>&nbsp;
                    <span>{confirmed.recovered}</span>
                  </div>
                </div>
              </MapMarker>
            ))}
          </Map>
        )}
      </main>
    </React.Fragment>
  )
}
