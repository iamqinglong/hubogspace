import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { useState, useRef, useEffect,useCallback } from 'react'
import MapGL,{Marker} from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";
import Pin from './Pin'

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFtcWluZ2xvbmciLCJhIjoiY2sxZ2I0Njc0MDA3bDNicjJlcGNxc2s5aCJ9.LvOJH3TarvmPUsu-gnJg0g";

const ReactMap =()=> {
  const [viewport, setViewport] = useState({
    latitude: 8.482374,
    longitude: 124.642375,
    zoom: 12,
    width: '650px',
    height: '400px'
  })
  const [marker, setMarker] = useState({latitude: 8.482374,longitude: 124.642375})
  const mapRef = useRef()
  const geocoderContainerRef = useRef()

  const handleOnResult = evt => {
      setMarker({
        longitude: evt.result.geometry.coordinates[0],
        latitude: evt.result.geometry.coordinates[1]
      })
  };
  const handleClick = evt => {
    setMarker({
      longitude: evt.lngLat[0],
      latitude: evt.lngLat[1]
    })
  }
  const onMarkerDragEnd =(evt)=> {
    
    setMarker({
      longitude: evt.lngLat[0],
      latitude: evt.lngLat[1]
    })
  }
  const getCursor = (isHovering, isDragging) => {
    return isHovering ? 'pointer' : 'default';
  };
  return (
    <div>
      <div
        ref={geocoderContainerRef}
        style={{
          height: 50,
          background: "white",
          display: "flex",
          alignItems: "center",
          paddingLeft: 4
        }}
      />
      <MapGL
        ref={mapRef}
        getCursor={getCursor}
        onClick={handleClick}
        mapStyle={'mapbox://styles/mapbox/streets-v11'}
        {...viewport}
        onViewportChange={(viewport) => setViewport(viewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
      <Marker
        longitude={marker.longitude}
        latitude={marker.latitude}
        offsetTop={-20}
        offsetLeft={-10}
        draggable
        onDragEnd={onMarkerDragEnd}
      >
        <Pin size={20} />
      </Marker>
        <Geocoder
          bbox={[124.59800375729253,8.417559986106923,124.71069512182498,8.518502070506969]}
          mapRef={mapRef}
          containerRef={geocoderContainerRef}
          onResult={handleOnResult}
          onViewportChange={(viewport) => setViewport(viewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </MapGL>
    </div>
  );
  
}

export default ReactMap
