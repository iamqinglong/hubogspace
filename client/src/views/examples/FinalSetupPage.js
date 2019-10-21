import React from "react";

// reactstrap components
import {
  Button,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import LandingPageHeader from "components/Headers/LandingPageHeader.js";
import DefaultFooter from "components/Footers/DefaultFooter.js";
import NavbarComponent from "components/Navbars/NavbarComponent";

function FinalSetupPage() {
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
      <div className="wrapper">
        
        <div className="section section-contact-us text-center">
          <Container>
            <h2 className="title">Successfully Space Setup</h2>
            <p className="description">Your project is very important to us.</p>
          </Container>
        </div>
        <DefaultFooter />
      </div>
    </>
  );
}

export default FinalSetupPage;
