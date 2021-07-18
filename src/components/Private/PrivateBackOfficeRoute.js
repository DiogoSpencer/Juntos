import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const PrivateBackOfficeRoute = (props) => {
  const role = useSelector((state) => state.auth.role);
  const history = useHistory();

  useEffect(() => {
    if (role !== "MOD" || role !== "ADMIN") {
      history.push("/home");
    }
    // eslint-disable-next-line
  }, [role]);

  return <Fragment>{props.children}</Fragment>;
};

export default PrivateBackOfficeRoute;
