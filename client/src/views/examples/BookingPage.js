import React,{useEffect} from "react";
import Datetime from "react-datetime";
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
  UncontrolledTooltip,
  Form,
  FormGroup
} from "reactstrap";

// core components
import NavbarComponent from "components/Navbars/NavbarComponent";

function ProfilePage() {
  const [pills, setPills] = React.useState("1");
  useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });

  const style ={ 
    backgroundColor: 'transparent',
    border: '1px solid #150d0d',
    borderRadius: '30px',
    color: '#2c2c2c',
    height: 'auto',
    lineHeight: 'normal',
    fontSize: '0.8571em',
    // transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    boxShadow: 'none',
  }

  return (
    <>
      <NavbarComponent />
      <div className="wrapper">
        
        <div className="section" style={{padding: '200px', backgroundImage: "url(" + require("assets/img/login.jpg") + ")"}} >
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="6">
                <h4 className="title text-center">{pills == "1" ? 'Choose a Date' : 'Payment'}</h4>
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
                        <i className="now-ui-icons ui-1_calendar-60"></i>
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
                        <i className="now-ui-icons shopping_credit-card"></i>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </Col>
            </Row>
            <Row>
              <TabContent className="gallery" activeTab={"pills" + pills}>
                <TabPane tabId="pills1">
                  <Col className="ml-auto mr-auto" md="12">
                    <Row className="collections">
                      <Col md="12">
                            <div className="date">
                                <div className="datepicker-container">
                                    <FormGroup >
                                    <Datetime
                                        timeFormat={false}
                                        inputProps={{ placeholder: "Datetime Picker Here" }}
                                    />
                                    </FormGroup>
                                </div>
                            </div>
                      </Col>
                    </Row>
                  </Col>
                </TabPane>
                <TabPane tabId="pills2">
                  <Col className="ml-auto mr-auto" md="10">
                    <Row className="collections">
                      <Col md="6">
                      <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg1.jpg")}
                        ></img>
                      </Col>
                    </Row>
                  </Col>
                </TabPane>
              </TabContent>
            </Row>
          </Container>
        </div>
        {/* <TransparentFooter /> */}
      </div>
    </>
  );
}

export default ProfilePage;
