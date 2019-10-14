import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, { Component } from 'react'
import MapGL from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
 
 
class ReactMap extends Component {
  state = {
    viewport: {
      latitude: 8.482374,
      longitude: 124.642375,
      zoom: 12
    }
  }
 
  mapRef = React.createRef()
 
  handleViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    })
  }
 
  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 }
 
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    })
  }
 
  render() {
    return (
      <MapGL
        ref={this.mapRef}
        {...this.state.viewport}
        width={'650'}
        height={'400px'}
        onViewportChange={this.handleViewportChange}
        mapboxApiAccessToken={'pk.eyJ1IjoiaWFtcWluZ2xvbmciLCJhIjoiY2sxZ2I0Njc0MDA3bDNicjJlcGNxc2s5aCJ9.LvOJH3TarvmPUsu-gnJg0g'}>
        <Geocoder
          mapRef={this.mapRef}
          onViewportChange={this.handleGeocoderViewportChange}
          mapboxApiAccessToken={'pk.eyJ1IjoiaWFtcWluZ2xvbmciLCJhIjoiY2sxZ2I0Njc0MDA3bDNicjJlcGNxc2s5aCJ9.LvOJH3TarvmPUsu-gnJg0g'}
        />
      </MapGL>
    )
  }
}
 
export default ReactMap