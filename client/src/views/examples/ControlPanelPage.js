import React,{useState,useEffect} from "react";
import MapGL,{Marker} from "react-map-gl";
import Pin from 'components/Pin'
import cookie from 'js-cookie'
import axios from 'axios'
// reactstrap components
import {
  Card,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  CardBody,
  TabPane,
  TabContent,
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  FormGroup,
  Label,
} from "reactstrap";

// core components
import NavbarComponent from "components/Navbars/NavbarComponent";
import ControlPanelBooking from "components/ControlPanelBooking";

function ControlPanelPage() {
    const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFtcWluZ2xvbmciLCJhIjoiY2sxZ2I0Njc0MDA3bDNicjJlcGNxc2s5aCJ9.LvOJH3TarvmPUsu-gnJg0g";
    const token = cookie.get('token')
    const [iconPills, setIconPills] = useState("1");
    const [nameFocus, setNameFocus] = useState(false);
    const [priceFocus, setPriceFocus] = useState(false);
    const [contactFocus, setContactFocus] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [contact, setContact] = useState('')
    const [payments, setPayments] = useState([])
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [pictures, setPictures] = useState([])
    const [geolocation, setGeolocation] = useState({longitude: 0, latitude: 0})
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [space, setSpace] = useState({})
    const [edit, setEdit] = useState(false)
    const [viewport, setViewport] = useState({
        latitude: 8.482374,
        longitude: 124.642375,
        zoom: 12,
        width: '650px',
        height: '400px'
      })
    const [marker, setMarker] = useState({latitude: 8.482374,longitude: 124.642375})

    useEffect(() => {
        document.body.classList.add("landing-page");
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        return function cleanup() {
        document.body.classList.remove("landing-page");
        document.body.classList.remove("sidebar-collapse");
        };
    });
    
    useEffect(() => {
       getSpace()
    },[]);

    const getSpace = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const res = await axios.get('http://localhost:8000/api/getSpace')
            setSpace({...res.data.space})
            setPayments([...res.data.payments])
            setPictures([...res.data.images])
            // console.log(space)
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleOnChange = (e,setFunction) => {
        const val = e.target.value
        setFunction(val)
    }

    const handleCheckBoxClick = (e) => {
        if(e.target.checked)
            setPayments([...payments,e.target.value])
    }

    useEffect(()=> {
        if(space.length>0)
            console.log(space)
    },[space])

  return (
    <>
      <NavbarComponent color={'info'} />
      <div className="wrapper">
        <div className="section">
            <Container>
            <Row>
                <Col className="ml-auto mr-auto" md="12" xl="12">
                <Card>
                    <CardHeader>
                    <Nav className="justify-content-center" role="tablist" tabs>
                        <NavItem>
                        <NavLink
                            className={iconPills === "1" ? "active" : ""}
                            href="#pablo"
                            onClick={e => {
                            e.preventDefault();
                            setIconPills("1");
                            }}
                        >
                            <i className="now-ui-icons shopping_cart-simple"></i>
                            Profile
                        </NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink
                            className={iconPills === "2" ? "active" : ""}
                            href="#pablo"
                            onClick={e => {
                            e.preventDefault();
                            setIconPills("2");
                            }}
                        >
                            <i className="now-ui-icons education_agenda-bookmark"></i>
                            Bookings
                        </NavLink>
                        </NavItem>
                    
                    </Nav>
                    </CardHeader>
                    <CardBody>
                    <TabContent
                        className="text-center"
                        activeTab={"iconPills" + iconPills}
                    >
                        <TabPane tabId="iconPills1">
                        <Container>
                        <Row>
                            <Col className="text-center ml-auto mr-auto" lg="8" md="8">
                                <InputGroup className={nameFocus ? "input-group-focus" : ""}>
                                <Input
                                    readOnly={!edit ? true : false}
                                    placeholder="Make a name"
                                    type="text"
                                    value={space.name || ''}
                                    onChange={(e) => {handleOnChange(e,setName)}}
                                ></Input>
                                </InputGroup>
                                <InputGroup className={priceFocus ? "input-group-focus" : ""}>
                                <Input
                                    readOnly={!edit ? true : false}
                                    placeholder="Set a price ₱"
                                    type="number"
                                    onFocus={() => setPriceFocus(true)}
                                    onBlur={() => setPriceFocus(false)}
                                    onChange={(e) => {handleOnChange(e,setPrice)}}
                                    value={space.price || ''}
                                ></Input>
                                </InputGroup>
                                <InputGroup className={contactFocus ? "input-group-focus" : ""}>
                                <Input
                                    readOnly={!edit ? true : false}
                                    placeholder="Set a contact number"
                                    type="text"
                                    onFocus={() => setContactFocus(true)}
                                    onBlur={() => setContactFocus(false)}
                                    onChange={(e) => {handleOnChange(e,setContact)}}
                                    value={space.contact || ''}
                                ></Input>
                                </InputGroup>
                                <InputGroup>
                                    <div className="textarea-container">
                                    <Input
                                        cols="100"
                                        name="name"
                                        placeholder="Description"
                                        rows="4"
                                        type="textarea"
                                        onChange={(e) => {handleOnChange(e,setDescription)}}
                                        value={space.description || ''}
                                        readOnly={!edit ? true : false}
                                    ></Input>
                                    </div>
                                </InputGroup>
                                <InputGroup className={addressFocus ? "input-group-focus" : ""}>
                                <Input
                                    placeholder="Type complete address"
                                    type="numbtexter"
                                    onFocus={() => setAddressFocus(true)}
                                    onBlur={() => setAddressFocus(false)}
                                    onChange={(e) => {handleOnChange(e,setAddress)}}
                                    value={space.address || ''}
                                    readOnly={!edit ? true : false}
                                ></Input>
                                </InputGroup>
                                <div className="textarea-container">
                                {
                                    Object.keys(space).length > 0 ? ( 
                                            <MapGL 
                                            latitude={parseFloat(space.latitude)}
                                            longitude={parseFloat(space.longitude)}
                                            zoom={15}
                                            width={'650px'}
                                            height={'400px'}
                                            // onViewportChange={(viewport) => setViewport(viewport)}
                                            mapboxApiAccessToken={MAPBOX_TOKEN} 
                                            mapStyle={'mapbox://styles/mapbox/streets-v11'}>
                                                
                                                        <Marker longitude={parseFloat(space.longitude)}
                                                            latitude={parseFloat(space.latitude)}>
                                                        <Pin size={30}/>
                                                        </Marker>
                                                    
                                            
                                            </MapGL>
                                    ):('')
                                }
                                </div>
                                <div className="text-center ml-auto mr-auto">
                                <p className="text-center"><strong>Accept Mode of Payments</strong></p>
                                <Row>
                                    
                                    {
                                        payments.map((payment) => 
                                            <Col key={payment.id}>
                                            <FormGroup check>
                                                <Label check>
                                                <Input defaultChecked disabled type="checkbox" value={payment.id} onChange={handleCheckBoxClick}></Input>
                                                <span className="form-check-sign"></span>
                                                    {payment.name}
                                                </Label>
                                            </FormGroup>
                                            </Col>
                                        )
                                    }
        
                                </Row>
                                </div>
                                <div>
                                <p className="text-center"><strong> Gallery</strong></p>
                                <Col className="ml-auto mr-auto" md="10">
                                    <Row className="collections">
                                    {
                                        pictures.map((picture) =>
                                            <Col md="6" key={picture.id}>
                                                <img
                                                alt="..."
                                                className="img-raised"
                                                src={ pictures.length > 0 ? `http://localhost:8000/storage/${picture.filename}` : ''}
                                                
                                                ></img>
                                            </Col>
                                        )
                                    }
                                    
                                    </Row>
                                </Col>
                                </div>
                                
                            </Col>
                            </Row>
                        </Container>
                        </TabPane>
                        <TabPane tabId="iconPills2">
                            <ControlPanelBooking/>
                        </TabPane>
                    </TabContent>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </Container>
        </div>
      </div>
    </>
  );
}

export default ControlPanelPage;
