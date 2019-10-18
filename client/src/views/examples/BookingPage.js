import React,{useState,useEffect} from "react";
import Datetime from "react-datetime";
import StripeCheckout from 'react-stripe-checkout'
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input
} from "reactstrap";

// core components
import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";
import DefaultFooter from "components/Footers/DefaultFooter.js";
import NavbarComponent from "components/Navbars/NavbarComponent";
import MyBookingsPage from "./MyBookingsPage";
import axios from 'axios'
function BookingPage(props) {
  const [pills, setPills] = useState("1");
  const [paymentMode, setPaymentMode] = useState("1");

  const handleCheck =(e) =>{
    setPaymentMode(e.target.value)
  }
  const handleToken = async(token,addresses)=>{
    console.log(token,addresses)
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.post(`http://localhost:8000/api/payWithStripe`,token,props.location.state.space)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
  return (
    <>
      <NavbarComponent color={'info'} />
      <div className="wrapper">
        <div className="section">
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="6">
                <h4 className="title text-center">My Portfolio</h4>
                <div className="nav-align-center">
                  <Nav
                    className="nav-pills-info nav-pills-just-icons"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={pills === "1" ? "active" : ""}
                        href="#pablo"
                        onClick={e => {
                          e.preventDefault();
                          setPills("1");
                        }}
                      >
                        <i className="now-ui-icons design_image"></i>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={pills === "2" ? "active" : ""}
                        href="#pablo"
                        onClick={e => {
                          e.preventDefault();
                          setPills("2");
                        }}
                      >
                        <i className="now-ui-icons location_world"></i>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={pills === "3" ? "active" : ""}
                        href="#pablo"
                        onClick={e => {
                          e.preventDefault();
                          setPills("3");
                        }}
                      >
                        <i className="now-ui-icons sport_user-run"></i>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
            <TabContent
                className="gallery"
                activeTab={"pills" + pills}
            >
                <TabPane tabId="pills1">
                <Col className="ml-auto mr-auto" md="12">
                    
                    {/* <div style={{marginLeft:'420px'}}> */}
                    <Row>
                    <label className="text-center">Check-in</label>
                    <FormGroup>
                            <Datetime
                                inputProps={{ placeholder: "Datetime Picker Here" }}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                    <label className="text-center">Check-out</label>
                    <FormGroup>
                            <Datetime
                                inputProps={{ placeholder: "Datetime Picker Here" }}
                            />
                        </FormGroup>
                    </Row>
                    {/* </div>  */}

                </Col>
                </TabPane>
                <TabPane tabId="pills2">
                <Col className="ml-auto mr-auto" md="12">
                    
                    <div style={{marginLeft:'66px'}}>
                    <FormGroup check className="form-check-radio" inline>
                        <Label check>
                        <Input
                            defaultChecked
                            id="inlineRadio1"
                            name="inlineRadioOptions"
                            type="radio"
                            value="1"
                            onChange={handleCheck}
                        ></Input>
                        Cash <span className="form-check-sign"></span>
                        </Label>
                    </FormGroup>
                    <FormGroup check className="form-check-radio" inline>
                        <Label check>
                        <Input
                            id="inlineRadio2"
                            name="inlineRadioOptions"
                            type="radio"
                            value="2"
                            onChange={handleCheck}
                        ></Input>
                        Card <span className="form-check-sign"></span>
                        </Label>
                    </FormGroup>
                    {
                        paymentMode === '1' ? (
                            <Button
                            block
                            className="btn-round"
                            color="info"
                            href="#pablo"
                            size="lg"
                            style={{marginLeft: '-26px'}}
                            >Book Now</Button>
                            
                        ) : (<StripeCheckout 
                            style={{
                                display: 'flex',
                                marginLeft: '7px'
                            }}
                            stripeKey={'pk_test_0C8J2ReyIjCJ5lizBDCj4H8H00kQIM48Iy'}
                            token={handleToken}
                            amount={props.location.state.space.price*100}
                            product={props.location.state.space}
                            currency={'PHP'}
                        />)
                    }
                    </div> 
                </Col>
                </TabPane>
            </TabContent>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}

export default BookingPage;
