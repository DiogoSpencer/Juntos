import { Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps } from "../../store/store";
import Footer from "./Footer";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const Layout = (props) => {
  return (
    <Fragment>
      <NavBar />
      <main>
        {props.isLogged && <SideBar />}
        {props.children}
      </main>
      <Footer />
    </Fragment>
  );
};

export default connect(mapStateToProps)(Layout);
