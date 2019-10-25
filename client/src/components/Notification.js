import React from 'react'
import { Link } from "react-router-dom";
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
  } from "reactstrap";
const Notification = () => {
    return (
        <div>
            <UncontrolledDropdown nav>
            <DropdownToggle
            caret
            color="default"
            href="#pablo"
            nav
            onClick={e => e.preventDefault()}
            >
            <i className="now-ui-icons users_single-02"></i>
            <span class="badge badge-danger">6</span>
            
            </DropdownToggle>
            <DropdownMenu>
        
            <DropdownItem >
            <li>
                <p>
                    Your “Volume Trendline” PDF is ready
                    <span class="timeline-date">Dec 10, 22:00</span>
                </p>
            </li>
            </DropdownItem>
            
            <DropdownItem to="/setup-page" tag={Link}>
            <i className="now-ui-icons ui-1_settings-gear-63"></i>
            Setup
            </DropdownItem>
            <DropdownItem
                to="/mybookings" tag={Link}
            >
                <i className="now-ui-icons education_agenda-bookmark"></i>
                My Bookings 
            </DropdownItem>
                    
            </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
}

export default Notification
