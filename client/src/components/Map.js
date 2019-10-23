
// import '../assets/css/map.css'
// import ControlPanel from 'components/ControlPanel'
// import SidebarPanel from 'components/SidebarPanel'
// import "mapbox-gl/dist/mapbox-gl.css";
// import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import React, { useState, useRef, useEffect,useCallback } from 'react'
// import MapGL,{Marker,Popup, StaticMap} from "react-map-gl";
// import Geocoder from "react-map-gl-geocoder";
// import Pin from './Pin'
// import axios from 'axios'
// import DeckGL from '@deck.gl/react';
// import {LineLayer,PathLayer} from '@deck.gl/layers';

// const MAPBOX_TOKEN =
//   "pk.eyJ1IjoiaWFtcWluZ2xvbmciLCJhIjoiY2sxZ2I0Njc0MDA3bDNicjJlcGNxc2s5aCJ9.LvOJH3TarvmPUsu-gnJg0g";

// const Map =()=> {
//     const [viewport, setViewport] = useState({
//         latitude: 8.482374,
//         longitude: 124.642375,
//         width: "100vw",
//         height: "100vh",
//         zoom: 13,
//       })

// //       latitude: 8.4286956
// // longitude: 124.288512
//     const [marker, setMarker] = useState({latitude: 8.482374,longitude: 124.642375})
//     const [userLocation, setUserLocation] = useState({longitude:124.655783, latitude :8.482082})
//     const data = [{
//         name: "random-name",
//         color: [101, 147, 245],
//         path:[[-74.00578, 40.713067],
//                 [-74.004577, 40.712425],
//                 [-74.003626, 40.713650],
//                 [-74.002666, 40.714243],
//                 [-74.002136, 40.715177],
//                 [-73.998493, 40.713452],
//                 [-73.997981, 40.713673],
//                 [-73.997586, 40.713448],
//                 [-73.99256, 40.713863]]}
//        ]
//     const [spaces, setSpaces] = useState([])
//     const [selectedSpace, setSelectedSpace] = useState(null)
//     const getAllSpaces =async () => {
//         try {
//             const res = await axios.get(`http://localhost:8000/api/getAllSpaces`)
//             console.log(res.data)
//             setSpaces([...res.data])
//         } catch (error) {
//             console.log(error)
//         }
//     }
    
//     const getUserLocation = async () =>{
//         navigator.geolocation.getCurrentPosition(async (position) => {
//             const location = { longitude : position.coords.longitude, latitude: position.coords.latitude}
//             setUserLocation({...location})
//             console.log(location)
//             setViewport({
//                 latitude: location.latitude,
//                 longitude: location.longitude,
//                 width: "100vw",
//                 height: "100vh",
//                 zoom: 13,
//             })
//         });
//       }
//       const layer = [
//         new PathLayer({
//          id: "path-layer",
//          data,
//          getWidth: data => 7,
//          getColor: data => data.color,
//          widthMinPixels: 7
//        })
//       ]
    
//     useEffect( () => {
         
        
//         const listener = (e) => {
//               if(e.key === 'Escape') {
//                 setSelectedSpace(null)
//               }
//             }
//             window.addEventListener('keydown', listener)
        
//             return () => {
//               window.removeEventListener('keydown', listener)
//             };
//     }, [])
//     useEffect(() =>{
//         getAllSpaces()
//     },[])
//     // useEffect(() =>{
//     //     getUserLocation()
//     // },[])
//     useEffect(() =>{
//         console.log(userLocation)
//     },[userLocation])
//     return (
//         <div>
            
//             <div className={'map'}>
            
//             <MapGL 
//              mapStyle={'mapbox://styles/mapbox/streets-v11'}
//             //  {...viewport}
//              onViewportChange={(viewport) => {setViewport(viewport)}}
//              mapboxApiAccessToken={MAPBOX_TOKEN}
//             >
//             {/* {
//                 spaces.length > 0 ? (
//                     spaces.map((space) => 
//                         <Marker key={space.id} latitude={space.latitude} longitude={space.longitude}>
//                                 <button className="marker-btn" onClick={(e) => {
//                                     e.preventDefault()
//                                     setSelectedSpace({
//                                         ...space
//                                         })
//                                     }}> 
//                                     <img src="cheers.svg" alt=""/>
//                                 </button>
//                         </Marker>
//                     )
//                 ): ('')
//             }
//             {
//                  userLocation.latitude  && userLocation ? (
//                     <Marker key={3} latitude={userLocation.latitude} longitude={userLocation.longitude}>
//                         <Pin size={20} />
//                     </Marker>
//                 ) : null
//             }
//             {

//                 selectedSpace ? (
//                     <Popup 
//                     latitude={selectedSpace.latitude}
//                     longitude={selectedSpace.longitude}
//                     onClose={()=>{
//                     setSelectedSpace(null)
//                     }}
//                     >
//                     <div>
//                         <h1>{selectedSpace.name}</h1>
//                     </div>
//                     </Popup>
//                 ) : null
//             } */}
            
//             </MapGL>
//             <DeckGL initialViewState={
//                 {
//                     longitude: -74.006,
//                     latitude: 40.7128,
//                     zoom: 12
//                 }
//             } layers={layer} controllable={true}>
//             </DeckGL>
//             </div>
//             {
//                 selectedSpace ? (
//                     <SidebarPanel space={{...selectedSpace}}/>
//                 ) : null
//             }
//             <ControlPanel/>
//         </div>
//     )
// }

// export default Map;
