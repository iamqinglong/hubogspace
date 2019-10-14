import React from 'react'
import Map from 'components/Map'
import 'assets/css/custom.css'
import NavbarComponent from 'components/Navbars/NavbarComponent';
const LandingPage =()=>{
    return (
        <div>
            <NavbarComponent color={'info'}/>
            <Map />
        </div>
    )
}

export default LandingPage