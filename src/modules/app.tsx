import React, { FC } from 'react'
import { GrowthChart } from './GrowthChart'

export type AppProps = {}
export const App: FC<AppProps> = () => {
  return <GrowthChart />
}

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

//   const handleDrawerOpen = () => setOpenDrawer(true)
//   const handleDrawerClose = () => setOpenDrawer(false)

//   // wait for countries before rendering map
//   if (!countries) return null

//   return (
//     <React.Fragment>
//       <Header
//         title="Coronavirus Visualization"
//         handleDrawerOpen={handleDrawerOpen}
//       >
//         <Autocomplete
//           name="countries"
//           data={countries}
//           inputLabel={''}
//           disableCloseOnSelect
//           value={selectedCountry}
//           onChange={(e, value) => {
//             console.log(e) // FIXME: how to ignore parameter e??
//             if (value) setSelectedCountry(value)
//           }}
//           getOptionLabel={(option: Country) => option.name}
//           renderOption={(option: Country) => (
//             <>
//               <span>{option.code}</span>
//               {option.name}
//             </>
//           )}
//         />
//       </Header>

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
//       <Drawer handleDrawerClose={handleDrawerClose} open={openDrawer}>
//         <List>
//           {statsResponse &&
//             statsResponse.data &&
//             statsResponse.data.locations.map((item, index) => (
//               <ListItem button key={index} onClick={() => listItemClick(item)}>
//                 <ListItemText
//                   primary={`${item.province || item.country} (${
//                     item.latest.confirmed
//                   })`}
//                   secondary={`Deaths: ${item.latest.deaths} Recovered: ${item.latest.recovered}`}
//                 />
//               </ListItem>
//             ))}
//         </List>
//       </Drawer>
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
