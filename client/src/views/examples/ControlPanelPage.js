import React, {useState, useEffect} from "react";
import ReactMap from 'components/ReactMap'
import ImageUploader from 'react-images-upload';
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

function ControlPanelPage() {
  const [firstFocus, setFirstFocus] = useState(false);
  const [lastFocus, setLastFocus] = useState(false);
  const [pictures, setPictures] = useState([])

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
    setPictures({...pictures, pictureFiles})
	}
  return (
    <>
      <NavbarComponent color={'info'}/>
      <div className="wrapper">
       
        <div className="section section-contact-us text-center">
          <Container>
            <h2 className="title">Have a space for rent ? Setup now!</h2>
            <Row>
              <Col className="text-center ml-auto mr-auto" lg="8" md="8">
                <InputGroup className={firstFocus ? "input-group-focus" : ""}>
                  <Input
                    placeholder="Make a name"
                    type="text"
                    onFocus={() => setFirstFocus(true)}
                    onBlur={() => setFirstFocus(false)}
                  ></Input>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="now-ui-icons shopping_shop"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup className={firstFocus ? "input-group-focus" : ""}>
                  <Input
                    placeholder="Set a price ₱"
                    type="number"
                    onFocus={() => setFirstFocus(true)}
                    onBlur={() => setFirstFocus(false)}
                  ></Input>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="now-ui-icons shopping shop"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup className={firstFocus ? "input-group-focus" : ""}>
                      <ImageUploader
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
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
                        <Input defaultChecked type="checkbox"></Input>
                        <span className="form-check-sign"></span>
                        Cash
                        </Label>
                    </FormGroup>
                    </Col>
                    <Col >
                    <FormGroup check>
                        <Label check>
                        <Input  type="checkbox"></Input>
                        <span className="form-check-sign"></span>
                        Credit/Debit Card
                        </Label>
                    </FormGroup>
                    </Col>
                    <Col >
                    <FormGroup check>
                        <Label check>
                        <Input  type="checkbox"></Input>
                        <span className="form-check-sign"></span>
                        Paypal
                        </Label>
                    </FormGroup>
                    </Col>
                </Row>
                </div>
                <div className="textarea-container">
                  <Input
                    cols="100"
                    name="name"
                    placeholder="Rules and Regulations"
                    rows="4"
                    type="textarea"
                  ></Input>
                </div>
                <p className="text-center">Search or Drag red marker or Click on the Map</p>
                <p className="text-center">PS: It automatically get the geolocation</p>
                <div className="textarea-container">
                    <ReactMap/>
                </div>
                <div className="send-button">
                  <Button
                    block
                    className="btn-round"
                    color="info"
                    href="#pablo"
                    onClick={e => e.preventDefault()}
                    size="lg"
                  >
                    Setup
                  </Button>
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

export default ControlPanelPage;
