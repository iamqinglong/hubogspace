import React,{useState,useEffect} from "react";
import axios from 'axios'
import cookie from 'js-cookie'
import {useDispatch} from 'react-redux'
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

const LoginPage = (props) =>{
  const [firstFocus, setFirstFocus] = useState(false);
  const [lastFocus, setLastFocus] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        email : email,
        password : password,
      }
      const res = await axios.post('http://localhost:8000/api/auth/login',data)
      cookie.set("token", res.data.access_token)
      dispatch(setLogin(res.data.user))
      if(props.location.state !== undefined)
      {
        props.history.push({
          pathname: '/booking-page',
          state: { 
            space: props.location.state.space,
          }
        })
      }
      else
        {props.history.push('/index')}
    } catch (error) {
      setErrors(error.response.data.errors)
    }
  }
  useEffect(() => {
    console.log(props.location.state)
    
  }, [])
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
            backgroundImage: "url(" + require("assets/img/login.jpg") + ")"
          }}
        ></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form  onSubmit={submit}>
                  <CardHeader className="text-center">
                    <div className="logo-container">
                      <img
                        alt="..."
                        src={require("assets/img/now-logo.png")}
                      ></img>
                    </div>
                     
                  </CardHeader>
                  <CardBody>
                    <InputGroup
                      className={"input-lg"+
                        (firstFocus ? " input-group-focus" : "")
                      }
                    >
                      
                      <Input
                        invalid={errors.email ? true:false}
                        placeholder="Email Address..."
                        type="email"
                        onFocus={() => setFirstFocus(true)}
                        onBlur={() => setFirstFocus(false)}
                        onChange={(e)=>{handleOnChange(e,setEmail)}}
                      ></Input>
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      {
                        errors.email ? (<FormFeedback>{errors.email[0]}</FormFeedback>) : ''
                        
                      }
                    </InputGroup>
                    <InputGroup
                      className={
                        "input-lg" +
                        (lastFocus ? " input-group-focus" : "")
                      }
                    >
                      
                      <Input
                        invalid={errors.password ? true:false}
                        placeholder="Password..."
                        type="password"
                        onFocus={() => setLastFocus(true)}
                        onBlur={() => setLastFocus(false)}
                        onChange={(e)=>{handleOnChange(e,setPassword)}}
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
                  </CardBody>
                  <CardFooter className="text-center">
                      {
                        errors.result ? (<strong style={{color:'red'}}>{errors.result}</strong>) : ''
                        
                      }
                    <Button
                      type="submit"
                      block
                      className="btn-round"
                      color="info"
                      // onClick={submit}
                      size="lg"
                    >
                      Get Started
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

export default LoginPage;
