import React, {useEffect, useState} from "react";
import {useDispatch} from 'react-redux'
import axios from 'axios'
import cookie from 'js-cookie'
import {setLogin} from 'store/actions/index'
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  FormFeedback
} from "reactstrap";

// core components
import TransparentFooter from "components/Footers/TransparentFooter.js";
import NavbarComponent from "components/Navbars/NavbarComponent";

const SignUpPage =(props)=> {

  const [firstFocus, setFirstFocus] = useState(false);
  const [lastFocus, setLastFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [passwordConfirmFocus, setPasswordConfirmFocus] = useState(false);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [role, setRole] = useState('lessee')
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()

  const handleOnChange = (e,setFunction) => {
    const val = e.target.value
    setFunction(val)
  }
  
  const submit = async (e) => {
    e.preventDefault()
    try {
      const data =  {
        first_name : firstName,
        last_name : lastName,
        email : email,
        password : password,
        password_confirm : passwordConfirm,
        role : role,
      }
      const res = await axios.post('http://localhost:8000/api/auth/register',data)

      cookie.set("token", res.data.access_token)
      dispatch(setLogin(res.data.user))
      if(res.data.user.role === 'lessor'){
        props.history.push('/setup-page')
      }else{
        props.history.push('/')
      }
      
    } catch (error) {
      setErrors(error.response.data.errors)
    }
  }
  
  useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
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
            backgroundImage: "url(" + require("assets/img/3.jpg") + ")"
          }}
        ></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form action="" className="form" method="" onSubmit={submit}>
                  <CardHeader className="text-center">
            
                    <h1>Sign Up</h1>
                  </CardHeader>
                  <CardBody>
                    <InputGroup
                      className={
                        "input-lg" +
                        (firstFocus ? " input-group-focus" : "")
                      }
                    >
                      
                      <Input
                         
                        invalid={errors.first_name ? true:false}
                        placeholder="First Name..."
                        type="text"
                        onFocus={() => setFirstFocus(true)}
                        onBlur={() => setFirstFocus(false)}
                        onChange={(e) => {handleOnChange(e,setFirstName)}}
                      ></Input>
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      {
                        errors.first_name ? (<FormFeedback>{errors.first_name[0]}</FormFeedback>) : ''
                        
                      }
                    </InputGroup>
                    <InputGroup
                      className={
                        "input-lg" +
                        (lastFocus ? " input-group-focus" : "")
                      }
                    >
                      
                      <Input
                        invalid={errors.last_name ? true:false}
                        placeholder="Last Name..."
                        type="text"
                        onFocus={() => setLastFocus(true)}
                        onBlur={() => setLastFocus(false)}
                        onChange={(e) => {handleOnChange(e,setLastName)}}
                      ></Input>
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="now-ui-icons text_caps-small"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                       {
                        errors.last_name ? (<FormFeedback>{errors.last_name[0]}</FormFeedback>) : ''
                        
                      }
                    </InputGroup>
                    <InputGroup
                      className={
                        "input-lg" +
                        (emailFocus ? " input-group-focus" : "")
                      }
                    >
                      
                      <Input
                        invalid={errors.email ? true:false}
                        placeholder="Email Address..."
                        type="email"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        onChange={(e) => {handleOnChange(e,setEmail)}}
                      ></Input>
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="now-ui-icons text_caps-small"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      {
                        errors.email ? (<FormFeedback>{errors.email[0]}</FormFeedback>) : ''
                        
                      }
                    </InputGroup>
                    <InputGroup
                      className={
                        "input-lg" +
                        (passwordFocus ? " input-group-focus" : "")
                      }
                    >
                      
                      <Input
                        invalid={errors.password ? true:false}
                        placeholder="Pasword..."
                        type="password"
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        onChange={(e) => {handleOnChange(e,setPassword)}}
                      ></Input>
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="now-ui-icons text_caps-small"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      {
                        errors.password ? (<FormFeedback>{errors.password[0]}</FormFeedback>) : ''
                        
                      }
                    </InputGroup>
                    <InputGroup
                      className={
                        "input-lg" +
                        (passwordConfirmFocus ? " input-group-focus" : "")
                      }
                    >
                      
                      <Input
                        invalid={errors.password_confirm ? true:false}
                        placeholder="Confirm Password..."
                        type="password"
                        onFocus={() => setPasswordConfirmFocus(true)}
                        onBlur={() => setPasswordConfirmFocus(false)}
                        onChange={(e) => {handleOnChange(e,setPasswordConfirm)}}
                      ></Input>
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="now-ui-icons text_caps-small"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      {
                        errors.password_confirm ? (<FormFeedback>{errors.password_confirm[0]}</FormFeedback>) : ''
                        
                      }
                    </InputGroup>
                    <Input className="dropdown" type="select" value={role} onChange={(e)=> {handleOnChange(e,setRole)}}>
                      <option value="lessee">Lessee</option>
                      <option value="lessor">Lessor</option>
                    </Input>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button
                      type="submit"
                      block
                      className="btn-round"
                      color="info"
                      size="lg"
                    >
                      Create Account
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
        <TransparentFooter />
      </div>
    </>
  );
}

export default SignUpPage;
