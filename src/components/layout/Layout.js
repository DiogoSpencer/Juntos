import { Fragment } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Layout = (props) => {
  return (
    <Fragment>
      <NavBar />
      <main>{props.children}</main>
      <Footer />
    </Fragment>
  );
};

export default Layout;
