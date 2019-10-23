import React,{useState,useEffect, Fragment} from 'react';
import MapGL, { Source, Layer,Marker, Popup } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import Pin from './Pin'
import ControlPanel from 'components/ControlPanel'
import SidebarPanel from 'components/SidebarPanel'

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFtcWluZ2xvbmciLCJhIjoiY2sxZ2I0Njc0MDA3bDNicjJlcGNxc2s5aCJ9.LvOJH3TarvmPUsu-gnJg0g";



const SearchableMap =()=> {
  const [viewport, setViewport] = useState({
      latitude: 8.482374,
      longitude: 124.642375,
      width: "100vw",
      height: "100vh",
      zoom: 13,
  })
  const [data, setData] = useState(null)
  const [duration, setDuration] = useState(null)
  const [distance, setDistance] = useState(null)
  const [spaces, setSpaces] = useState([])
  const [userLocation, setUserLocation] = useState({longitude:124.655783, latitude :8.482082})
  const [selectedSpace, setSelectedSpace] = useState(null)
  
  const getDirections = async (longFrom,latFrom,longTo,latTo) => {
    try {
      const res = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/%20${longFrom}%2C${latFrom}%3B${longTo}%2C${latTo}.json?access_token=pk.eyJ1IjoiaWFtcWluZ2xvbmciLCJhIjoiY2sxZzJ3N2RwMDZ4NTNuczA4NGs2ZzV6OCJ9.isWRmnhN8Blc35zGxzGBEg&geometries=geojson`)
      console.log(res.data)
      setData(res.data.routes[0].geometry)
      setDistance(res.data.routes[0].distance)
      setDuration(res.data.routes[0].duration)
    } catch (error) {
      console.log(error)
    }
  }

  const getUserLocation = async () =>{
    navigator.geolocation.getCurrentPosition(async (position) => {
        const location = { longitude : position.coords.longitude, latitude: position.coords.latitude}
        setUserLocation({...location})
        console.log(location)
        setViewport({
            latitude: location.latitude,
            longitude: location.longitude,
            width: "100vw",
            height: "100vh",
            zoom: 13,
        })
    });
  }

  const getAllSpaces =async () => {
    try {
        const res = await axios.get(`http://localhost:8000/api/getAllSpaces`)
        console.log(res.data)
        setSpaces([...res.data])
    } catch (error) {
        console.log(error)
    }
}

const markerClick = async (e,space) => {
  e.preventDefault()
  getDirections(userLocation.longitude,userLocation.latitude,space.longitude,space.latitude)
  setSelectedSpace({
    ...space
    })
  
}
  

  useEffect(() =>{
      getAllSpaces()
      getUserLocation()
      // getDirections(viewport.longitude,viewport.latitude,userLocation.longitude,userLocation.latitude)
  },[])

  useEffect( () => {   
    const listener = (e) => {
      if(e.key === 'Escape') {
        setSelectedSpace(null)
        setData(null)
        setDistance(null)
        setDuration(null)
      }
    }
    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
      
    };
}, [])
  return (
    <MapGL
    style={{ width: '100%', height: '100vh' }}
    mapStyle={'mapbox://styles/mapbox/streets-v11'}
      accessToken={MAPBOX_TOKEN}
      onViewportChange={(viewport) => setViewport(viewport)}
      {...viewport}
    >
    {
      spaces.length > 0 ? (
          spaces.map((space) => 
              <Marker key={space.id} latitude={space.latitude} longitude={space.longitude}>
                      <button className="marker-btn" onClick={(e)=>markerClick(e,space)}> 
                          <img src="cheers.svg" alt=""/>
                      </button>
              </Marker>
          )
      ): ('')
    }
    {
        userLocation.latitude  && userLocation ? (
            <Marker key={3} latitude={userLocation.latitude} longitude={userLocation.longitude}>
                <Pin size={20} />
            </Marker>
        ) : null
    }
    {
      selectedSpace ? (
          <Popup 
          latitude={selectedSpace.latitude}
          longitude={selectedSpace.longitude}
          onClose={()=>{
          setSelectedSpace(null)
          setData(null)
          setDistance(null)
          setDuration(null)
          }}
          >
          <div>
              <h1>{selectedSpace.name}</h1>
          </div>
          </Popup>
      ) : null
    }
    {
      selectedSpace ? (
          <SidebarPanel space={{...selectedSpace}} duration={duration} distance={distance}/>
      ) : null
    }
    { 
      data ? (
            <Fragment>
              <Source id="route" type="geojson" data={data} />
              <Layer
                id="route"
                type="line"
                source="route"
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                }}
                paint={{
                  'line-color': '#7fb4ec',
                  'line-width': 7
                }}
              />
            </Fragment>
            
        ) : ('')
    }
    
    </MapGL>
  )
}

export default SearchableMap