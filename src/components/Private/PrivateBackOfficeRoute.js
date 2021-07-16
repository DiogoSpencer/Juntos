import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const PrivateRoute = (props) => {
  const role = useSelector((state) => state.auth.role);
  const history = useHistory();

  useEffect(() => {
    if (role === "USER" || role === "PARTNER") {
      history.goBack();
    }
  }, [role]);

  return <Fragment>{props.children}</Fragment>;
};

export default PrivateRoute;
