import React, {useState,useEffect, Fragment} from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios'
import {useDispatch} from 'react-redux'
import {setLogout} from 'store/actions/index'
import cookie from 'js-cookie'
// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  UncontrolledTooltip
} from "reactstrap";

function NavbarComponent(props) {

  const loggedIn = useSelector(state=>state.auth.loggedIn)
  const user = useSelector(state=>state.auth.user)
  const dispatch = useDispatch()
  let token = cookie.get('token')
  let color = props.color ? props.color : "navbar-transparent"
  const [navbarColor, setNavbarColor] = useState(color);
  const [collapseOpen, setCollapseOpen] = useState(false);

  useEffect(() => {
    const updateNavbarColor = () => {
      
      if(color === "navbar-transparent")
      {
        //scroll down
        if (
          (document.documentElement.scrollTop > 399 ||
          document.body.scrollTop > 399)
        ) {
          setNavbarColor("");
        }
        //scroll up
        else if (
          document.documentElement.scrollTop < 400 ||
          document.body.scrollTop < 400
        ) {
          setNavbarColor("navbar-transparent");
        }
      }
      
    };
    window.addEventListener("scroll", updateNavbarColor);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });

  const logout = async (e)=> {
    e.preventDefault()
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.post('http://localhost:8000/api/auth/logout')
      cookie.remove('token')
      dispatch(setLogout())
      props.history.push('/login-page')
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() =>{
    console.log('navbar')
  },[])

  return (
    <>
      {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null}
      <Navbar className={"fixed-top " + navbarColor} color="info" expand="lg">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand
              to="/index"
              tag={Link}
              // target="_blank"
              // id="navbar-brand"

            >
              HubogSpace
            </NavbarBrand>
            {/* <UncontrolledTooltip target="#navbar-brand">
              Home
            </UncontrolledTooltip> */}
            <button
              className="navbar-toggler navbar-toggler"
              onClick={() => {
                document.documentElement.classList.toggle("nav-open");
                setCollapseOpen(!collapseOpen);
              }}
              aria-expanded={collapseOpen}
              type="button"
            >
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse
            className="justify-content-end"
            isOpen={collapseOpen}
            navbar
          >
            <Nav navbar>
              {
                loggedIn ? (<UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    href="#pablo"
                    nav
                    onClick={e => e.preventDefault()}
                  >
                    <i className="now-ui-icons users_single-02"></i>
                    <p>{user.last_name}</p>
                  </DropdownToggle>
                  <DropdownMenu>
                    {
                      (user.role === 'lessor') ? (
                        (user.space_name) ? (
                          <DropdownItem to="/control-panel-page" tag={Link}>
                            <i className="now-ui-icons ui-1_settings-gear-63"></i>
                            Control Panel
                          </DropdownItem>
                        ):
                          (<DropdownItem to="/setup-page" tag={Link}>
                            <i className="now-ui-icons ui-1_settings-gear-63"></i>
                            Setup
                          </DropdownItem>) ): ('')
                    }
                    
                    <DropdownItem
                      target="_blank"
                    >
                      <i className="now-ui-icons education_agenda-bookmark"></i>
                      My Bookings 
                    </DropdownItem>
                    <DropdownItem
                      onClick={logout}
                      target="_blank"
                    >
                      <i className="now-ui-icons media-1_button-power"></i>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                  ) : (
                  <Fragment>
                    <NavItem>
                      <NavLink to="/login-page" tag={Link}>
                        Login
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink to="/sign-up-page" tag={Link}>
                        Sign Up
                      </NavLink>
                    </NavItem>
                  </Fragment>
                )
              }
              
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
