import React,{useState,useEffect} from "react";
import Datetime from "react-datetime";
import StripeCheckout from 'react-stripe-checkout'
import moment from 'moment'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import NavbarComponent from "components/Navbars/NavbarComponent";
import axios from 'axios'
import cookie from 'js-cookie'
toast.configure()
const BookingPage =(props)=> {
  const [pills, setPills] = useState("1");
  const [paymentMode, setPaymentMode] = useState(null);
  const [expectedArrival, setExpectedArrival] = useState(null)
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
      const res = await axios.post(`http://localhost:8000/api/bookAndPayStripe`,{token,space,expectedArrival})
      if(res.data.state){
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
        props.history.push('/mybookings')
      }
      else{
        toast.warn(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      }
      
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }

  }
  const handleExpectedArrival = async (value) => {
    
    if((checkOut !== null && moment.isMoment(checkOut) === true)){
      const time = moment(value).format('HH:mm')
      setCheckOut(checkOut.set({hour: time.split(':')[0], minute: time.split(':')[1]}))
    }
      
    setExpectedArrival(value)
    setDisable(false)

  }
 

  const changeTab = async (e,value)=> {
    e.preventDefault();
  
    if(expectedArrival === null || moment.isMoment(expectedArrival) === false)
    {
      
      setWarning('Choosed date either null or not valid')
      return
    }
    if(expectedArrival.isBefore(Datetime.moment()))
      {
        setWarning('Check the time')
        return
      }
    setPills(value)
    setWarning(false)
  }
  
  const valid = ( current ) =>{
      const yesterday = Datetime.moment().subtract(1, 'day');
      return current.isAfter( yesterday );
  };

  const handleBook =async ()=> {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${cookie.get('token')}`;
      const space = props.location.state.space
      const res = await axios.post(`http://localhost:8000/api/book`,{space,expectedArrival})
      if(res.data.state)
      {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
          props.history.push('/mybookings')
      }
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
                <h4 className="title text-center">{pills === '1' ? 'Choose date': 'Choose Payment Method'}</h4>
                {
                      warning ? (
                        <h4 className="title text-center" style={{color:'red'}}>{warning}</h4>
                        ) : null
                }
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
                   
                    </Row>
                    <Row>
                    <label className="text-center">Expected Arrival</label>
                    <FormGroup>
                            <Datetime
                                inputProps={{ placeholder: "Expected Arrival" }}
                                onChange={handleExpectedArrival}
                                isValidDate={ valid }
                            />
                        </FormGroup>
                    </Row>

                </Col>
                </TabPane>
                <TabPane tabId="pills2">
                <Col className="ml-auto mr-auto" md="12">
                    <Container>
                      <Row>
                      {
                      props.location.state.space.payments.map((payment,index) => {
                          if(payment.name === 'Cash'){
                            return (
                              <Col key={index}>
                              <Button
                              block
                              className="btn-round"
                              color="info"
                              size="lg"
                              onClick={handleBook}
                              >Pay in Cash
                              
                              </Button>
                              </Col>
                            )
                          }
                          else if(payment.name ==='Card'){
                              return(
                                <Col key={index}>
                                  <StripeCheckout 
                                      style={{
                                        position: 'relative',
                                        bottom: '-26px'
                                      }}
                                      stripeKey={'pk_test_XtHFdL6fP8UPdJCiWTN2ZmGc00gzVZ1ZxB'}
                                      token={handleToken}
                                      amount={props.location.state.space.price*100}
                                      product={props.location.state.space}
                                      currency={'USD'}
                                  />
                                </Col>
                              )
                          }
                        
                      })
                           
                      
                    }
                      </Row>
                    </Container>
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
