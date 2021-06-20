import { Fragment } from "react";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const Layout = (props) => {
  const isLogged = useSelector((state) => state.auth.isLogged)

  return (
    <Fragment>
      <NavBar />
      <main>
        {isLogged && <SideBar />}
        {props.children}
      </main>
      <Footer />
    </Fragment>
  );
};

export default Layout;
