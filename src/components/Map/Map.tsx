import React, { FC, ReactNode } from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'
import { makeStyles } from '@material-ui/core/styles'

export type MapProps = {
  className?: string
  center?: [number, number]
  zoom?: number
  children: ReactNode
}

export const Map: FC<MapProps> = ({ center, zoom, children }) => {
  return (
    <LeafletMap
      style={{ width: '100%', height: '95vh' }}
      center={center}
      zoom={zoom}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
    </LeafletMap>
  )
}

const useStyles = makeStyles({
  popup: {
    width: '310px'
  }
})

// import Icon from '@material-ui/icons/PersonOutline'
// import L from 'leaflet'

// const iconPerson = new L.Icon({
//   iconUrl: ,
//   iconRetinaUrl: require('../img/marker-pin-person.svg'),
//   iconAnchor: undefined,
//   popupAnchor: undefined,
//   shadowUrl: undefined,
//   shadowSize: undefined,
//   shadowAnchor: undefined,
//   iconSize: new L.Point(60, 75),
//   className: 'leaflet-div-icon'
// })

export type MapMarkerProps = {
  id: number
  onClose?: () => void
  children: ReactNode
  position: [number, number]
}
export const MapMarker: FC<MapMarkerProps> = ({
  id,
  onClose,
  children,
  position
}) => {
  const classes = useStyles()
  const [latitude, longitude] = position

  // TODO: Validate longitude / latitude rather than just check for falsy value
  if (!latitude || !longitude) return null

  return (
    <Marker id={id} position={position} data-test-id={`marker_${id}`}>
      {children ? (
        <Popup className={classes.popup} onClose={onClose}>
          {children}
        </Popup>
      ) : null}
    </Marker>
  )
}
