import React,{useState,useEffect} from "react";
import Datetime from "react-datetime";
import StripeCheckout from 'react-stripe-checkout'
import moment from 'moment'
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
  Input,
  Alert
} from "reactstrap";

// core components
import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";
import DefaultFooter from "components/Footers/DefaultFooter.js";
import NavbarComponent from "components/Navbars/NavbarComponent";
import MyBookingsPage from "./MyBookingsPage";
import axios from 'axios'
import cookie from 'js-cookie'
function BookingPage(props) {
  const [pills, setPills] = useState("1");
  const [paymentMode, setPaymentMode] = useState(null);
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [warning, setWarning] = useState(false)
  const [amount, setAmount] = useState(0)
  const [disable, setDisable] = useState(true)

  const handleCheck =(e) =>{
    setPaymentMode(e.target.value)
  }
  const handleToken = async(token,addresses)=>{
    console.log(token,addresses)
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${cookie.get('token')}`;
      const space = props.location.state.space
      
      // const check_in = checkIn.toString()
      // console.log(check_in)
      // console.log(moment(check_in).format('MM/DD/YYYY h:mm A'))
      // const check_out = checkOut.toString()
      const res = await axios.post(`http://localhost:8000/api/payWithStripe`,{token,space,amount,checkIn,checkOut})
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }

  }
  const handleCheckIn = async (value) => {
    
    if((checkOut !== null && moment.isMoment(checkOut) === true)){
      const time = moment(value).format('HH:mm')
      setCheckOut(checkOut.set({hour: time.split(':')[0], minute: time.split(':')[1]}))
    }
      
    setCheckIn(value)
    setDisable(false)

  }
  const handleCheckOut = async (value) => {
    const time = moment(checkIn).format('HH:mm')
    // const newValue = value.add(time.split(':')[0],'hours').add(time.split(':')[1],'minutes')
    // console.log(newValue)
    setCheckOut(value.set({hour: time.split(':')[0], minute: time.split(':')[1]}))
  }
  const changeTab = async (e,value)=> {
    e.preventDefault();
    if(value === "2") {
      if(checkIn === null || moment.isMoment(checkIn) === false)
      {
        
        setWarning('Check-in either null or not valid')
        return
      }
      if((checkOut === null || moment.isMoment(checkOut) === false))
      {
        setWarning('Check-out either null or not valid')
        return
      }
      if(checkOut.isBefore(checkIn) || checkOut.isSame(checkIn))
      {
        setWarning('Check-out need before the Check-in')
        return
      }
      // if(checkOut.isSame(checkIn))
      // {
      //   console.log('same')
      //   setWarning(true)
      //   return
      // }
      if(checkIn.isBefore(Datetime.moment()))
      {
        setWarning('Check the Check-in time')
        return
      }
    }
    setPills(value)
    setWarning(false)
    calAmount()
  }
  
  const valid = ( current ) =>{
      const yesterday = Datetime.moment().subtract(1, 'day');
      return current.isAfter( yesterday );
  };


  const calAmount = () => {
    const diff = checkOut.diff(checkIn,'days')
    if(diff === 0){
      setAmount( (props.location.state.space.price*100) )
    }
    else{
      setAmount( (props.location.state.space.price*100) * diff )
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
                        onClick={(e)=>{changeTab(e,"1")}}
                      >
                        <i className="now-ui-icons design_image"></i>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={pills === "2" ? "active" : ""}
                        onClick={(e)=>{changeTab(e,"2")}}
                      >
                        <i className="now-ui-icons location_world"></i>
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
                    
                    <Row>
                    {
                      warning ? (<label className="text-center">
                                <strong style={{color:'red'}}>
                                {warning}
                                </strong>
                                </label>) : null
                    }
                    </Row>
                    <Row>
                    <label className="text-center">Check-in</label>
                    <FormGroup>
                            <Datetime
                                inputProps={{ placeholder: "Check-in/Arrival" }}
                                onChange={handleCheckIn}
                                isValidDate={ valid }
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                    <label className="text-center">Check-out</label>
                    <FormGroup>
                            <Datetime
                                timeFormat={false}
                                inputProps={{ placeholder: "Checkout",disabled: disable }}
                                onChange={handleCheckOut}
                                isValidDate={ valid }
                            />
                        </FormGroup>
                    </Row>

                </Col>
                </TabPane>
                <TabPane tabId="pills2">
                <Col className="ml-auto mr-auto" md="12">
                    
                    <div style={{marginLeft:'66px'}}>
                    {
                      props.location.state.space.payments.map(payment => 
                           <FormGroup key={payment.id} check className="form-check-radio" inline>
                                  <Label check>
                                  <Input
                                      id="inlineRadio1"
                                      name="inlineRadioOptions"
                                      type="radio"
                                      value={payment.name}
                                      onChange={handleCheck}
                                  ></Input>
                                  {payment.name} <span className="form-check-sign"></span>
                                  </Label>
                              </FormGroup>
                      )
                    }
                    {
                        paymentMode === 'Cash' ? (
                            <Button
                            block
                            className="btn-round"
                            color="info"
                            href="#pablo"
                            size="lg"
                            style={{marginLeft: '-26px'}}
                            >Book Now</Button>
                            
                        ) : paymentMode === 'Card' ? (<StripeCheckout 
                            style={{
                                display: 'flex',
                                marginLeft: '7px'
                            }}
                            stripeKey={'pk_test_0C8J2ReyIjCJ5lizBDCj4H8H00kQIM48Iy'}
                            token={handleToken}
                            amount={amount}
                            product={props.location.state.space}
                            currency={'PHP'}
                        />) : null
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
