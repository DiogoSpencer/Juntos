import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import classes from "./NavBar.module.css";
import logo from "../../img/logo.png";
import Login from "../Login/LoginJS";
import { useState } from "react";

const NavBar = () => {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const username = useSelector((state) => state.auth.username);

  const [loginShow, setLoginShow] = useState(false);

  const hideModalHandler = () => {
    setLoginShow(false);
  };

  const showModalHandler = () => {
    setLoginShow(true);
  };

  return (
    <div className={classes.navHeader}>
      <div className={classes.navImgDiv}>
        <img className={classes.logo} src={logo} alt="logo" />
      </div>
      <nav className={classes.navBar}>
        <ul className={classes.navList}>
          <li className={classes.navItem}>
            <NavLink
              activeClassName={classes.navLinkActive}
              className={classes.navLink}
              exact
              to="/home"
              isActive={(match, location) => {
                if (location.hash === "" && match) {
                  return true;
                }
                return false;
              }}
            >
              juntos
            </NavLink>
          </li>
          <li className={classes.navItem}>
            <NavLink
              activeClassName={classes.navLinkActive}
              className={classes.navLink}
              to="/home#herois"
              isActive={(match, location) => {
                if (location.hash === "#herois" && match) {
                  return true;
                }
                return false;
              }}
            >
              Heróis
            </NavLink>
          </li>
          <li className={classes.navItem}>
            <NavLink
              activeClassName={classes.navLinkActive}
              className={classes.navLink}
              to="/home#parceiros"
              isActive={(match, location) => {
                if (location.hash === "#parceiros" && match) {
                  return true;
                }
                return false;
              }}
            >
              Parceiros
            </NavLink>
          </li>
          <li className={classes.navItem}>
            <NavLink
              activeClassName={classes.navLinkActive}
              className={classes.navLink}
              to="/home#app"
              isActive={(match, location) => {
                if (location.hash === "#app" && match) {
                  return true;
                }
                return false;
              }}
            >
              App
            </NavLink>
          </li>
          <li className={classes.navItem}>
            <NavLink
              activeClassName={classes.navLinkActive}
              className={classes.navLink}
              to="/faq"
            >
              FAQ
            </NavLink>
          </li>
          {!isLogged && (
            <li className={classes.navItem}>
              <span className={classes.loginLink} onClick={showModalHandler}>
                Login
              </span>
              {loginShow && <Login onClose={hideModalHandler} />}
            </li>
          )}
          {isLogged && (
            <li className={classes.navItem}>
              <NavLink
                activeClassName={classes.navLinkActive}
                className={classes.navLink}
                to={`/perfil/${username}`}
              >
                <img src="" alt="user-profile" />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;

/*

              <NavLink
                activeClassName={classes.navLinkActive}
                className={classes.navLink}
                to="/login"
              >
                Login
              </NavLink>

*/
