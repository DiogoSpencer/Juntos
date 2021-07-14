import { useSelector } from "react-redux";
import Footer from "./Footer";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import classes from "./Layout.module.css";
import OfficeBar from "../BackOffice/OfficeBar";
import { useLocation, useRouteMatch } from "react-router";

const Layout = (props) => {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const location = useLocation();

  return (
    <div className={classes.mainContainer}>
      <header className={classes.mainNav}>
        <NavBar />
      </header>
      <main className={classes.mainBody}>
        <aside className={classes.sideBar}> {isLogged && <SideBar />}</aside>
        {location.pathname.startsWith("/backoffice") && (
          <aside className={classes.backOfficeSideBar}>
            <OfficeBar />
          </aside>
        )}
        {props.children}
      </main>
      <div className={classes.mainFooter}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
