import React, { FC, useState, useEffect } from 'react'
import {
  Country,
  CountriesApi,
  CountryStatistics,
  TimelineValue,
  CountryStatisticsApi
} from './types'
import { useApi } from 'src/api'
import { Statistics } from './Statistics'
import { Autocomplete } from 'components/Autocomplete'
import { PermanentDrawer } from 'components/Drawer'
import { LineChart } from 'components/LineChart'
import {
  Box
  // List,
  // ListItem,
  // ListItemText
} from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { format } from 'date-fns'
import { Map, MapMarker } from 'components/Map'

// TODO:

// - setup countries dropdown list
// - load map when selected country
// - pull appropriate data to load components
// - Create drawer layout
// - add statistics box in drawer
// - move graph into drawer
// - toggle button to control statistic types (confirmed, recovered, deaths/fatalities)

const drawerWidth = 425

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1),
      marginLeft: `${drawerWidth}px`
    }
  })
)

export type AppProps = {}
export const App: FC<AppProps> = () => {
  const classes = useStyles()

  // Countries
  const [countriesReq] = useApi<CountriesApi>()
  const [countries, setCountries] = useState<Country[]>()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>({
    code: 'US',
    name: 'US'
  })

  // Country Statistics
  const [statsReq] = useApi<CountryStatisticsApi>()
  const [statistics, setStatistics] = useState<CountryStatistics>()

  const [statesRequest, statesResponse] = useApi<CountryStatisticsApi>(
    'https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs'
  )

  // Load contries when app loads
  // TODO: cache?
  useEffect(() => {
    const getCountries = async () => {
      countriesReq
        .get<CountriesApi>('https://covid19.mathdro.id/api/countries')
        .then((response) => {
          if (response.status === 200) {
            const allCountries: Country[] = response.data.countries.map(
              (country) => ({ name: country.name, code: country.iso2 })
            )

            setCountries(allCountries)
          }
        })
    }

    getCountries()
  }, [])

  // Load statistics for selected country
  useEffect(() => {
    const getStatistics = async (code: string) => {
      statsReq
        .get<CountryStatisticsApi>(
          `https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=${code}&timelines=1`
        )
        .then((response) => {
          if (response.status === 200) {
            const { locations } = response.data

            if (!locations || locations.length <= 0) return

            const { timelines, latest } = locations[0]

            // FIXME: pulling first item in array... review this!
            const timeline = timelines.confirmed.timeline
            const confirmedCases: TimelineValue[] = Object.entries(
              timeline
            ).map(([key, value]) => ({
              key: format(new Date(key), 'MM-dd'),
              confirmed: value,
              type: 'confirmed'
            }))

            const result: CountryStatistics = {
              timelines: confirmedCases,
              ...latest
            }
            setStatistics(result)
          }
        })
    }

    if (selectedCountry) {
      getStatistics(selectedCountry.code)
    }
  }, [selectedCountry])

  return (
    <div>
      <main className={classes.content}>
        <Map center={[38.7, -77.48]} zoom={6}>
          {statesRequest.status === 'resolved' &&
            statesResponse &&
            statesResponse.data.locations
              .filter((x) => x.province === 'Virginia')
              .map((stat, index) => (
                <MapMarker
                  id={index}
                  key={index}
                  onClose={() => console.log('closed')}
                  position={[
                    stat.coordinates.latitude,
                    stat.coordinates.longitude
                  ]}
                >
                  <Statistics
                    title={`${stat.province || ''} - ${stat.county ||
                      ''} County`}
                    confirmed={stat.latest.confirmed}
                    deaths={stat.latest.deaths}
                    recovered={stat.latest.recovered}
                  />
                </MapMarker>
              ))}
        </Map>
      </main>
      <PermanentDrawer title={'Coronavirus Visualization'} width={drawerWidth}>
        <Box
          display={'flex'}
          justifyContent={'center'}
          paddingTop={'16px'}
          paddingBottom={'16px'}
        >
          {(countriesReq.status === 'idle' ||
            countriesReq.status === 'pending') && <span>Loading...</span>}
          {countriesReq.status === 'rejected' && (
            <span>{countriesReq.error || 'ERROR'}</span>
          )}
          {countries && (
            <Autocomplete
              name="countries"
              data={countries}
              inputLabel={''}
              value={selectedCountry}
              onChange={(e, value) => {
                console.log(e.timeStamp) // FIXME: how to ignore parameter e??
                if (value) setSelectedCountry(value)
              }}
              getOptionLabel={(option: Country) => option.name}
              renderOption={(option: Country) => (
                <>
                  <span>{option.code}</span>
                  {option.name}
                </>
              )}
            />
          )}
        </Box>

        {statistics && (
          <>
            <Statistics
              confirmed={statistics.confirmed}
              deaths={statistics.deaths}
              recovered={statistics.recovered}
            />
            <LineChart
              data={statistics.timelines}
              xAxisKey="key"
              yAxisKey="confirmed"
              width={400}
              height={225}
            />
          </>
        )}
      </PermanentDrawer>
    </div>
  )
}

// export type CountryStatisticsProps = {
//   data: CountryData
// }
// export const CountryStatistics: FC<CountryStatisticsProps> = ({ data }) => {
//   return (
//     <div>
//       <div>
//         <span>
//           <Typography variant="h5">
//             {data.provinceState || data.countryRegion}
//           </Typography>
//         </span>
//       </div>
//       <div>
//         <label>Confirmed</label>&nbsp;
//         <span>{data.confirmed}</span>
//       </div>
//       <div>
//         <label>Deaths</label>&nbsp;
//         <span>{data.deaths}</span>
//       </div>
//       <div>
//         <label>Recovered</label>&nbsp;
//         <span>{data.recovered}</span>
//       </div>
//     </div>
//   )
// }
// import { Autocomplete } from 'components/Autocomplete'
// import { Header } from 'components/Header'

// <Header
// title="Coronavirus Visualization"
// handleDrawerOpen={handleDrawerOpen}
// >
// {countries && (
//   <Autocomplete
//     name="countries"
//     data={countries}
//     inputLabel={''}
//     disableCloseOnSelect
//     value={selectedCountry}
//     onChange={(e, value) => {
//       console.log(e.timeStamp) // FIXME: how to ignore parameter e??
//       if (value) setSelectedCountry(value)
//     }}
//     getOptionLabel={(option: Country) => option.name}
//     renderOption={(option: Country) => (
//       <>
//         <span>{option.code}</span>
//         {option.name}
//       </>
//     )}
//   />
// )}
// </Header>

// <Select data={countries} />

// import React, { FC, useState, useEffect } from 'react'
// import { Map, MapMarker } from 'components/Map'
// import { Autocomplete } from 'components/Autocomplete'
// import { Header } from 'components/Header'
// import { Drawer } from 'components/Drawer'
// import { useApi } from 'src/api'
// import { Typography, List, ListItem, ListItemText } from '@material-ui/core'

// // https://coronavirus-tracker-api.herokuapp.com/v2/locations
// // https://coronavirus-tracker-api.herokuapp.com/v2/locations/v2/locations?country_code=US

// type Country = {
//   name: string
//   code: string
// }
// type CountriesApi = {
//   [key: string]: string
// }
// // type CountryData = {
// //   provinceState: string
// //   countryRegion: string
// //   lastUpdate: number
// //   lat: number
// //   long: number
// //   confirmed: number
// //   recovered: number
// //   deaths: number
// //   active: number
// // }

// type CountryStatisticsApi = {
//   locations: Array<CountryData>
// }
// type CountryData = {
//   coordinates: { latitude: number; longitude: number }
//   country: string
//   country_code: string
//   id: number
//   last_updated: Date
//   latest: { confirmed: number; deaths: number; recovered: number }
//   province: string
// }

// type MapDisplayProps = {
//   center: [number, number]
//   zoom: number
// }
// export type AppProps = {}
// export const App: FC<AppProps> = () => {
//   const [countriesRequest] = useApi<CountriesApi>()
//   const [countries, setCountries] = useState<Country[]>()
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>({
//     code: 'US',
//     name: 'US'
//   })
//   const [statsRequest, statsResponse] = useApi<CountryStatisticsApi>(
//     selectedCountry
//       ? `https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=${selectedCountry.code}`
//       : undefined
//   )
//   const [openDrawer, setOpenDrawer] = useState<boolean>(false)
//   const [mapDisplayProps, setMapDisplayProps] = useState<MapDisplayProps>({
//     center: [40.4, -125.7],
//     zoom: 4
//   })

//   const listItemClick = (item: CountryData) => {
//     const { latitude, longitude } = item.coordinates

//     const newProps: MapDisplayProps = {
//       center: [latitude, longitude],
//       zoom: 7
//     }
//     setMapDisplayProps(newProps)
//   }

//   // When app first loads, retrieve countries and format data
//   useEffect(() => {
//     const getCountries = async () => {
//       countriesRequest
//         .get<CountriesApi>('https://covid19.mathdro.id/api/countries')
//         .then((response) => {
//           if (response.status === 200) {
//             const myCountries: Country[] = Object.entries(
//               response.data.countries
//             ).map(([country, code]) => {
//               return { name: country, code }
//             })
//             setCountries(myCountries)
//           }
//         })
//     }

//     getCountries()
//   }, [])

//   // when country statistics are retrieved move the center position and zoom
//   useEffect(() => {
//     let lat = 40.4
//     let long = -95.7
//     if (statsResponse && statsResponse.data.locations.length > 0) {
//       const {
//         coordinates: { latitude, longitude }
//       } = statsResponse.data.locations[0]
//       lat = latitude
//       long = longitude
//     }

//     setMapDisplayProps({
//       center:
//         statsResponse && statsResponse.data.locations.length > 0
//           ? [lat, long]
//           : [40.4, -95.7],
//       zoom: 4
//     })
//   }, [statsResponse])

// const handleDrawerOpen = () => setOpenDrawer(true)
// const handleDrawerClose = () => setOpenDrawer(false)

//   // wait for countries before rendering map
//   if (!countries) return null

//   return (
//     <React.Fragment>
// <Header
//   title="Coronavirus Visualization"
//   handleDrawerOpen={handleDrawerOpen}
// >
//   <Autocomplete
//     name="countries"
//     data={countries}
//     inputLabel={''}
//     disableCloseOnSelect
//     value={selectedCountry}
//     onChange={(e, value) => {
//       console.log(e) // FIXME: how to ignore parameter e??
//       if (value) setSelectedCountry(value)
//     }}
//     getOptionLabel={(option: Country) => option.name}
//     renderOption={(option: Country) => (
//       <>
//         <span>{option.code}</span>
//         {option.name}
//       </>
//     )}
//   />
// </Header>

//       <main>
//         <Map center={mapDisplayProps.center} zoom={mapDisplayProps.zoom}>
//           {statsRequest.loading && <span>Loading...</span>}
//           {statsRequest.error && <div>Error!</div>}
//           {statsResponse &&
//             statsResponse.data.locations.map((stat, index) => (
//               <MapMarker
//                 id={index}
//                 key={index}
//                 onClose={() => console.log('closed')}
//                 position={[
//                   stat.coordinates.latitude,
//                   stat.coordinates.longitude
//                 ]}
//               >
//                 <CountryStatistics data={stat} />
//               </MapMarker>
//             ))}
//         </Map>
//       </main>
// <Drawer handleDrawerClose={handleDrawerClose} open={openDrawer}>
//   <List>
//     {statsResponse &&
//       statsResponse.data &&
//       statsResponse.data.locations.map((item, index) => (
//         <ListItem button key={index} onClick={() => listItemClick(item)}>
//           <ListItemText
//             primary={`${item.province || item.country} (${
//               item.latest.confirmed
//             })`}
//             secondary={`Deaths: ${item.latest.deaths} Recovered: ${item.latest.recovered}`}
//           />
//         </ListItem>
//       ))}
//   </List>
// </Drawer>
//     </React.Fragment>
//   )
// }

// export type CountryStatisticsProps = {
//   data: CountryData
// }
// export const CountryStatistics: FC<CountryStatisticsProps> = ({ data }) => {
//   return (
//     <div>
//       <div>
//         <span>
//           <Typography variant="h5">{data.province || data.country}</Typography>
//         </span>
//       </div>
//       <div>
//         <label>Confirmed</label>&nbsp;
//         <span>{data.latest.confirmed}</span>
//       </div>
//       <div>
//         <label>Deaths</label>&nbsp;
//         <span>{data.latest.deaths}</span>
//       </div>
//       <div>
//         <label>Recovered</label>&nbsp;
//         <span>{data.latest.recovered}</span>
//       </div>
//     </div>
//   )
// }
