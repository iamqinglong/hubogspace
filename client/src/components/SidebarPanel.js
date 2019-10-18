import React, {useEffect} from 'react';
import {Row,Button,Nav,FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom'
import Carousel from 'components/Carousel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobileAlt, faDollarSign, faCar } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux";

const SidebarPanel = (props) => {
    const ContainerWrapper = ({children}) => <div className="sidebar-panel">{children}</div>;
    const loggedIn = useSelector(state=>state.auth.loggedIn)
    useEffect(() => {
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        return function cleanup() {
          document.body.classList.remove("sidebar-collapse");
        };
      });

    return (
        
        <ContainerWrapper>
            <Row>
                <Carousel images={props.space.images}/>
            </Row>
            <br/>
            <Row className="justify-content-center">
                    <div className="pull-left">
                        <i className="now-ui-icons users_circle-08"></i>
                        {props.space.name}
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                        <i className="now-ui-icons location_pin"></i>
                        {props.space.address}
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                    <FontAwesomeIcon icon={faDollarSign}/>
                        {props.space.price}
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                    <FontAwesomeIcon icon={faMobileAlt}/>
                        {props.space.contact}
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                        <i className="now-ui-icons users_circle-08"></i>
                        {props.space.description}
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                        <i className="now-ui-icons location_compass-05"></i>
                        {(props.duration/60).toFixed(2)} mins
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                    <FontAwesomeIcon icon={faCar}/>
                        {(props.distance/1000).toFixed(2)} km/s
                    </div>
            </Row>
            <Nav>
                {
                    loggedIn ? (<Button
                        block
                        className="btn-round"
                        outline
                        color="info"
                        size="lg"
                        to="/booking-page"
                        tag={Link}
                        
                    >
                        Book Now
                        <div className="pull-right">
                        <i className="now-ui-icons ui-1_send"></i>
                        </div>
                    </Button>) : (
                        <Button
                        block
                        className="btn-round"
                        outline
                        color="info"
                        size="lg"
                        to={{
                            pathname: '/login-page',
                            state: {
                              fromSidebarPanel: true,
                              space: props.space
                            }
                        }}
                        tag={Link}
                        
                    >
                        Book Now
                        <div className="pull-right">
                        <i className="now-ui-icons ui-1_send"></i>
                        </div>
                    </Button>
                    )
                }
                
            </Nav>
        </ContainerWrapper>
    );
  
}

export default SidebarPanel