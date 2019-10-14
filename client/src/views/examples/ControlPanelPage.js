import React from "react";
import ReactMap from 'components/ReactMap'
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
  const [firstFocus, setFirstFocus] = React.useState(false);
  const [lastFocus, setLastFocus] = React.useState(false);
  const mapRef = React.createRef()
  React.useEffect(() => {
    document.body.classList.add("landing-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("landing-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
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
                <InputGroup className={firstFocus ? "input-group-focus" : ""}>
                  <Input
                    placeholder="Set an address"
                    type="text"
                    onFocus={() => setFirstFocus(true)}
                    onBlur={() => setFirstFocus(false)}
                  ></Input>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="now-ui-icons location_pin"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
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
