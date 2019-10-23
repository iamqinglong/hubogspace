import React from "react";
import {Link} from 'react-router-dom'
// reactstrap components
import {
  Button,
  Container,
  Col,
  Card,
  CardBody,
  Nav
} from "reactstrap";

// core components
import TransparentFooter from "components/Footers/TransparentFooter";
import "assets/css/hubogspace.css";
import NavbarComponent from "components/Navbars/NavbarComponent";

function IndexPage() {
  const [firstFocus, setFirstFocus] = React.useState(false);
  const [lastFocus, setLastFocus] = React.useState(false);
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
      <NavbarComponent />
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/login.jpg") + ")"
          }}
        ></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <CardBody>
                <Nav>
                    <Button
                    block
                    className="btn-round"
                    color="info"
                    href=""
                    // onClick={e => e.preventDefault()}
                    size="lg"
                    to="/landing-page"
                    tag={Link}
                  >
                      Search nearby   
                      <div className="pull-right">
                      <i className="now-ui-icons ui-1_zoom-bold"></i>
                      </div>
                  </Button>
                </Nav>
                </CardBody>
              </Card>
            </Col>
          </Container>
        </div>
        <TransparentFooter />
      </div>
    </>
  );
}

export default IndexPage;
