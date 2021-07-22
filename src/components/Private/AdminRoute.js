import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const MOD = "MOD";
const ADMIN = "ADMIN";

const AdminRoute = ({ component: Component, ...rest }) => {
  const role = useSelector((state) => state.auth.role);

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        role === ADMIN || role === MOD ? (
          <Component {...props} />
        ) : (
          <Redirect to="/backoffice" />
        )
      }
    />
  );
};

export default AdminRoute;
