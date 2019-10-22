import React, {useState,useEffect} from "react";
import axios from 'axios'
import cookie from 'js-cookie'
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

function FinalSetupPage(props) {
  const [message, setMessage] = useState('');
  const token = cookie.get('token')
  const saveStripe = async (code) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.post(`http://localhost:8000/api/stripe`,{code:code})
      setMessage(res.data.message)
    } catch (error) {
      console.log(error)
    }
  }
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
    const str = props.location.search.split('?code=')
    const code = str[1]
    saveStripe(code)
  }, [])
  return (
    <>
      <NavbarComponent color={'info'} />
      <div className="wrapper">
        
        <div className="section section-contact-us text-center">
          <Container>
            <h2 className="title">{message === '' ? (message):('Loading.....')}</h2>
          </Container>
        </div>
      </div>
    </>
  );
}

export default FinalSetupPage;
