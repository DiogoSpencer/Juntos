import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const BackOfficeRoute = (props) => {
  const role = useSelector((state) => state.auth.role);
  const history = useHistory();

  useEffect(() => {
    if (role === "USER") {
      history.push("/home");
    }
    // eslint-disable-next-line
  }, [role]);

  return <Fragment>{props.children}</Fragment>;
};

export default BackOfficeRoute;
