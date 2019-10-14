import { Route, Redirect } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
const AuthRoute = ({ component: Component, ...rest }) => {
  const loggedIn = useSelector(state=>state.auth.loggedIn)
  return (
    <Route
      {...rest}
      render={props =>
       loggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};


export default AuthRoute