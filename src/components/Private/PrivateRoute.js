import { Fragment } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { mapStateToProps } from "../../store/store";

const PrivateRoute = (props) => {
  return (
    <Fragment>{props.isLogged ? props.children : <Redirect to="/home" />}</Fragment>
  );
};

export default connect(mapStateToProps)(PrivateRoute);
