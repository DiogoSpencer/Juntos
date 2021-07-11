import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import gS from "../../services/generalServices.json";

const PrivateRoute = (props) => {
  const isLogged = useSelector((state) => state.auth.isLogged)
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem(gS.storage.token);
    
    if (!token) {
      history.push("/home")
    }

  }, [isLogged])

  return (
    <Fragment>{ props.children }</Fragment>
  );
};

export default PrivateRoute;
//isLogged ? props.children : <Redirect to="/home" />