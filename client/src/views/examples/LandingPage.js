import React from 'react'
import Map from 'components/Map'
import 'assets/css/custom.css'
import NavbarComponent from 'components/Navbars/NavbarComponent';
import SearchableMap from 'components/SearchableMap';
const LandingPage =()=>{
    return (
        <div>
            <NavbarComponent color={'info'}/>
            {/* <Map /> */}
            <SearchableMap/>
        </div>
    )
}

export default LandingPage