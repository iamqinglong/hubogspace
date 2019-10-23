import React, {useState, useEffect} from "react";
import ReactMap from 'components/ReactMap'
import ImageUploader from 'react-images-upload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobileAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux";
// reactstrap components
import {
  Button,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
} from "reactstrap";

// core components
import LandingPageHeader from "components/Headers/LandingPageHeader.js";
import DefaultFooter from "components/Footers/DefaultFooter.js";
import NavbarComponent from "components/Navbars/NavbarComponent";
import Progress from 'components/Progress'
import axios from "axios";
import cookie from 'js-cookie'

function SetupPage(props) {
  const user = useSelector(state=>state.auth.user)
  const [nameFocus, setNameFocus] = useState(false);
  const [priceFocus, setPriceFocus] = useState(false);
  const [contactFocus, setContactFocus] = useState(false);
  const [addressFocus, setAddressFocus] = useState(false);
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [contact, setContact] = useState('')
  const [payments, setPayments] = useState(['1'])
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [pictures, setPictures] = useState([])
  const [geolocation, setGeolocation] = useState({longitude: 0, latitude: 0})
  const token = cookie.get('token')
  const [uploadPercentage, setUploadPercentage] = useState(0);
  useEffect(() => {
    document.body.classList.add("landing-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return () => {
      document.body.classList.remove("landing-page");
      document.body.classList.remove("sidebar-collapse");
    };
  },[])
  const onDrop =(pictureFiles, pictureDataURLs)=> {
    console.log(pictureDataURLs, pictureFiles)
    setPictures([...pictureFiles])
  }
  
  const handleOnChange = (e,setFunction) => {
    const val = e.target.value
    setFunction(val)
  }

  const handleCheckBoxClick = (e) => {
      if(e.target.checked)
        setPayments([...payments,e.target.value])
  }

  const submit = async (e)=> {
    e.preventDefault()

    // const data = {user,name,price,contact,payments,description,address, geolocation}
  
    const fd = new FormData()
    fd.append('user_id',user.id)
    fd.append('name',name)
    fd.append('price',price)
    fd.append('contact',contact)
    payments.map((payment, key) => {
      fd.append(`payments[${key}]`,payment)
    })
    fd.append('description',description)
    fd.append('address',address)
    fd.append('longitude',geolocation.longitude)
    fd.append('latitude',geolocation.latitude)
    pictures.map((image, key) => {
      fd.append(`pictures[${key}]`,image)
    })
    try {

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.post('http://localhost:8000/api/spaces',fd, { headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );

        // Clear percentage
        setTimeout(() => setUploadPercentage(0), 10000);
      }
    
      })
      if(res.data.url !== undefined){
        window.location.assign(res.data.url)
      }else{
        props.history.push('/control-panel-page')
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    console.log(geolocation)
  }, [geolocation])

  return (
    <>
      <NavbarComponent color={'info'}/>
      <div className="wrapper">
       
        <div className="section section-contact-us text-center">
          <Container>
            <h2 className="title">Have a space for rent ? Setup now!</h2>
            <Row>
              <Col className="text-center ml-auto mr-auto" lg="8" md="8">
                <InputGroup className={nameFocus ? "input-group-focus" : ""}>
                  <Input
                    placeholder="Make a name"
                    type="text"
                    onFocus={() => setNameFocus(true)}
                    onBlur={() => setNameFocus(false)}
                    onChange={(e) => {handleOnChange(e,setName)}}
                  ></Input>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="now-ui-icons shopping_shop"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup className={priceFocus ? "input-group-focus" : ""}>
                  <Input
                    placeholder="Set a price ₱"
                    type="number"
                    onFocus={() => setPriceFocus(true)}
                    onBlur={() => setPriceFocus(false)}
                    onChange={(e) => {handleOnChange(e,setPrice)}}
                  ></Input>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                    <FontAwesomeIcon icon={faDollarSign}/>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup className={contactFocus ? "input-group-focus" : ""}>
                  <Input
                    placeholder="Set a contact number"
                    type="text"
                    onFocus={() => setContactFocus(true)}
                    onBlur={() => setContactFocus(false)}
                    onChange={(e) => {handleOnChange(e,setContact)}}
                  ></Input>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <FontAwesomeIcon icon={faMobileAlt}/>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup className={"input-group-focus"}>
                      <ImageUploader
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
                        maxFileSize={5242880}
                        withPreview={true}
                  />
                </InputGroup>
                <div className="text-center ml-auto mr-auto">
                <p className="text-center">Accept Mode of Payments</p>
                <Row>
                    <Col >
                    <FormGroup check>
                        <Label check>
                        <Input defaultChecked type="checkbox" value="1" onChange={handleCheckBoxClick}></Input>
                        <span className="form-check-sign"></span>
                        Cash
                        </Label>
                    </FormGroup>
                    </Col>
                    <Col >
                    <FormGroup check>
                        <Label check>
                        <Input  type="checkbox" value="2" onChange={handleCheckBoxClick}></Input>
                        <span className="form-check-sign" ></span>
                        Card/Stripe
                        </Label>
                    </FormGroup>
                    </Col>
                    <Col >
                    </Col>
                </Row>
                </div>
                <div className="textarea-container">
                  <Input
                    cols="100"
                    name="name"
                    placeholder="Description"
                    rows="4"
                    type="textarea"
                    onChange={(e) => {handleOnChange(e,setDescription)}}
                  ></Input>
                </div>
                <p className="text-center">Search or Drag red marker or Click on the Map</p>
                <p className="text-center">PS: It automatically get the geolocation</p>
                <InputGroup className={addressFocus ? "input-group-focus" : ""}>
                  <Input
                    placeholder="Type complete address"
                    type="numbtexter"
                    onFocus={() => setAddressFocus(true)}
                    onBlur={() => setAddressFocus(false)}
                    onChange={(e) => {handleOnChange(e,setAddress)}}
                    value={address}
                  ></Input>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="now-ui-icons location_pin"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <div className="textarea-container">
                    <ReactMap setAddress={setAddress} setGeolocation={setGeolocation}/>
                </div>
                <div className="send-button">
                  
                 
                  {
                    uploadPercentage > 0 ? (
                      <Button
                      block
                      className="btn-round"
                      color="info"
                      href="#pablo"
                      onClick={submit}
                      size="lg"
                      disabled
                    ><i className="now-ui-icons loader_gear spin"></i></Button>
                    ) : (
                      <Button
                      block
                      className="btn-round"
                      color="info"
                      href="#pablo"
                      onClick={submit}
                      size="lg"
                    >Setup</Button>
                    )
                  } 
                  
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        {/* <DefaultFooter /> */}
      </div>
    </>
  );
}

export default SetupPage;
