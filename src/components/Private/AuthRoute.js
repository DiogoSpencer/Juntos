import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import gS from "../../services/generalServices.json";

const MOD = "MOD";
const ADMIN = "ADMIN";

const AuthRoute = ({ component: Component, ...rest }) => {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const token = localStorage.getItem(gS.storage.token);

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/home" />
      }
    />
  );
};

export default AuthRoute;
///          <AuthRoute exact path="/minhasajudas" component={MyHelps}>
