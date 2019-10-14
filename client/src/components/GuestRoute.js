import { Route, Redirect } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
const GuestRoute = ({ component: Component, ...rest }) => {
const loggedIn = useSelector(state=>state.auth.loggedIn)
console.log(loggedIn)
  return (
    <Route
      {...rest}
      render={props =>
        !loggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};


export default GuestRoute