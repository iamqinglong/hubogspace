/*

=========================================================
* Now UI Kit React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-kit-react
* Copyright 2019 Creative Tim (http://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-kit-react/blob/master/LICENSE.md)

* Designed by www.invisionapp.com Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// styles for this kit
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss";
import "assets/demo/demo.css";
import "assets/demo/nucleo-icons-page-styles.css";
// pages for this kit
import Index from "views/Index.js";
import NucleoIcons from "views/NucleoIcons.js";
import LoginPage from "views/examples/LoginPage.js";
import IndexPage from "views/examples/IndexPage";
import ProfilePage from "views/examples/ProfilePage.js";
import SignUpPage from "views/examples/SignUpPage";
import LandingPage from "views/examples/LandingPage";
import BookingPage from "views/examples/BookingPage";
import MyBookingsPage from "views/examples/MyBookingsPage";
import SetupPage from "views/examples/SetupPage";
import store from './store/index'
import {Provider} from 'react-redux'
import AuthRoute from 'components/AuthRoute'
import GuestRoute from 'components/GuestRoute'
import axios from 'axios'
import cookie from 'js-cookie'
import jwt from 'jsonwebtoken'
import ControlPanelPage from "views/examples/ControlPanelPage";
import FinalSetupPage from "views/examples/FinalSetupPage";
let token = cookie.get('token')
const jwt_secret = 'N3uJKf77wT8V62DufhaPu666dDm624qZzUGHOV2TK4kgLcFSarPna7j0I2YVEEFG'

if(token) {
  jwt.verify(token, jwt_secret, (err, decoded)=> {
    if(err) {
      token = null
      cookie.remove('token')
    }
    else{
      if((decoded.iss !== 'http://localhost:8000/api/auth/login')&&(decoded.iss !== 'http://localhost:8000/api/auth/register')&&(decoded.iss !== 'http://localhost:8000/api/auth/me'))
      {
        token = null
        cookie.remove('token')
      }
    }
  });
}


const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Switch>
            {/* <Route path="/index" render={props => <Index {...props} />} /> */}
            <AuthRoute
              path="/mybookings"
              render={props => <MyBookingsPage {...props} />}
              component={MyBookingsPage}
            />
            <AuthRoute
              path="/booking-page"
              render={props => <BookingPage {...props} />}
              component={BookingPage}
            />
            <AuthRoute
              path="/final-setup-page"
              render={props => <FinalSetupPage {...props} />}
              component={FinalSetupPage}
            />
            <Route
              path="/nucleo-icons"
              render={props => <NucleoIcons {...props} />}
            />
            <Route
              path="/index"
              render={props => <IndexPage {...props} />}
            />
            <Route
              exact={true}
              path="/landing-page"
              render={props => <LandingPage {...props} />}
              component={LandingPage}
            />
            <GuestRoute
              path="/sign-up-page"
              render={props => <SignUpPage {...props} />}
              component={SignUpPage}
            />
             <GuestRoute 
              path="/login-page" 
              render={props => <LoginPage {...props} />} 
              component={LoginPage}
            />
            <AuthRoute
              path="/profile-page"
              render={props => <ProfilePage {...props} />}
              component={ProfilePage}
            />
            <AuthRoute
              path="/setup-page"
              render={props => <SetupPage {...props} />}
              component={SetupPage}
            />
            <AuthRoute
              path="/control-panel-page"
              render={props => <ControlPanelPage {...props} />}
              component={ControlPanelPage}
            />
            <Redirect to="/index" />
            <Redirect from="/" to="/index" />
          </Switch>
        </Switch>
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );
}

if(token)
{
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios.post('http://localhost:8000/api/auth/me')
    .then(res => {
      store.dispatch({type: "SET_LOGIN", payload: res.data})
      render()
    })

}
else {
  render()
}




