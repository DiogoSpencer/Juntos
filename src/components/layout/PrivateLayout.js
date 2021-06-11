import { Fragment } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const PrivateLayout = (props) => {
  return (
    <Fragment>
      <NavBar />
      <PrivateLayout/>
      <main>{props.children}</main>
      <Footer />
    </Fragment>
  );
};

export default PrivateLayout;
