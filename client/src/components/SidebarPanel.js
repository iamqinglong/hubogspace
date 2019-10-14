import React, {useEffect} from 'react';
import {Row,Button,Nav,FormGroup} from 'reactstrap';
import {Link} from 'react-router-dom'
import Carousel from 'components/Carousel'
import Datetime from "react-datetime";

const SidebarPanel = (props) => {
    const ContainerWrapper = ({children}) => <div className="sidebar-panel">{children}</div>;

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
                <Carousel/>
            </Row>
            <br/>
            <Row className="justify-content-center">
                    <div className="pull-left">
                        <i className="now-ui-icons users_circle-08"></i>
                        Owner
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                        <i className="now-ui-icons location_pin"></i>
                        Cdo, Misamis Oriental
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                        <i className="now-ui-icons users_circle-08"></i>
                        Price
                    </div>
            </Row>
            <Row className="justify-content-center">
                    <div className="pull-left">
                        <i className="now-ui-icons location_compass-05"></i>
                        30mins
                    </div>
            </Row>
            <Row className="justify-content-center">
                <div className="date">
                    <div className="datepicker-container">
                        <Datetime
                            timeFormat={false}
                            inputProps={{ placeholder: "Pick desired date..." }}
                        />
                    </div>
                </div>  
            </Row>
            <Nav>
                    <Button
                        block
                        className="btn-round"
                        outline
                        color="info"
                        // onClick={bookNow}
                        size="lg"
                        to="/booking-page"
                        tag={Link}
                    >
                        Reserved Now
                        <div className="pull-right">
                        <i className="now-ui-icons ui-1_send"></i>
                        </div>
                    </Button>
            </Nav>
        </ContainerWrapper>
    );
  
}

export default SidebarPanel