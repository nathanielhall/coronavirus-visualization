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
      style={{ width: '100%', height: '100vh' }}
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
