import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

const PrivateRoute = (props) => {
  const isLogged = useSelector((state) => state.auth.isLogged)

  return (
    <Fragment>{isLogged ? props.children : <Redirect to="/home" />}</Fragment>
  );
};

export default PrivateRoute;
