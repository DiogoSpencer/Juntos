import { useSelector } from "react-redux";
import Footer from "./Footer";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import classes from "./Layout.module.css";

const Layout = (props) => {
  const isLogged = useSelector((state) => state.auth.isLogged);

  return (
    <div className={classes.mainContainer}>
      <header className={classes.mainNav}>
        <NavBar />
      </header>
      <main className={classes.mainBody}>
        <aside className={classes.sideBar}> {isLogged && <SideBar />}</aside>
        {props.children}
      </main>
      <div className={classes.mainFooter}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
