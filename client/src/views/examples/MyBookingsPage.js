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
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "reactstrap";

// core components
import "assets/css/hubogspace.css";
import NavbarComponent from "components/Navbars/NavbarComponent";

function MyBookingsPage() {
  const [firstFocus, setFirstFocus] = React.useState(false);
  const [lastFocus, setLastFocus] = React.useState(false);
  React.useEffect(() => {
    // document.body.classList.add("landing-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
    //   document.body.classList.remove("landing-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
  return (
    <>
      <NavbarComponent color={'info'}/>
      <div className="page-header clear-filter" filter-color="blue">
        <div className="content">
          <Container>
            <h1>Table</h1>
          </Container>
        </div>
      </div>
    </>
  );
}

export default MyBookingsPage;
