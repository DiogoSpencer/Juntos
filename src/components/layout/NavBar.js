import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useHistory } from "react-router-dom";
import classes from "./NavBar.module.css";
import logo from "../../img/logo.png";
import logoutIcon from "../../img/exit.png";
import { useEffect, useState } from "react";
import ModalAuth from "../Login/ModalAuth.js";
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";
import { logout } from "../../services/http";
import userIcon from "../../img/userblue.png";
import { snackActions } from "../../store/snackBar/snack";

const NavBar = () => {
  const [disabledButton, setDisabledButton] = useState(false);
  const isLogged = useSelector((state) => state.auth.isLogged);
  const username = useSelector((state) => state.auth.username);
  const profileImg = useSelector((state) => state.auth.profileImg);
  const role = useSelector((state) => state.auth.role);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (history.location.pathname.includes("/juntos")) {
      const token = localStorage.getItem(gS.storage.token);
      if (!token) {
        history.replace("/home");
      }
    } else if (
      history.location.pathname === "/backoffice" &&
      (role === "USER" || !role)
    ) {
      const token = localStorage.getItem(gS.storage.token);
      if (!token) {
        history.replace("/home");
      }
    } else if (
      history.location.pathname.includes("/backoffice") &&
      (role === "USER" || role === "PARTNER")
    ) {
      const token = localStorage.getItem(gS.storage.token);
      if (!token) {
        history.replace("/home");
      }
    }
    // eslint-disable-next-line
  }, [history.location.pathname, role, isLogged]);

  const [loginShow, setLoginShow] = useState(false);

  const hideModalHandler = () => {
    setLoginShow(false);
  };

  const showModalHandler = () => {
    setLoginShow(true);
  };

  const logoutHandler = () => {
    setDisabledButton(true);
    setTimeout(() => {
      setDisabledButton(() => false);
    }, 2000);
    if (!disabledButton) {
      logout().then(
        (response) => {
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);

          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "success",
              snackBarMessage: "Logout efectuado com sucesso!",
            })
          );
          history.replace("/home");
        },
        (error) => {
          //logout anyways
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);

          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "success",
              snackBarMessage: "Logout efectuado com sucesso!",
            })
          );
          history.replace("/home");
        }
      );
    }
  };

  return (
    <div className={classes.navHeader}>
      <Link to="/home" className={classes.navImgDiv}>
        <img className={classes.logo} src={logo} alt="juntos" />
      </Link>
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
              Dúvidas
            </NavLink>
          </li>
          {!isLogged && (
            <li className={classes.navItem}>
              <span className={classes.loginLink} onClick={showModalHandler}>
                Login
              </span>
              {loginShow && <ModalAuth onClose={hideModalHandler} />}
            </li>
          )}
          {isLogged && (
            <li className={classes.navItem}>
              <NavLink
                activeClassName={classes.navLinkActive}
                className={classes.navLink}
                to={`/juntos/perfil/${username}`}
              >
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="perfil"
                    className={classes.profileImg}
                  />
                ) : (
                  <img
                    src={userIcon}
                    alt="perfil"
                    className={classes.profileImg}
                  />
                )}
              </NavLink>
            </li>
          )}
          {isLogged && (
            <li className={classes.navItem}>
              <img
                src={logoutIcon}
                alt="logout"
                onClick={logoutHandler}
                className={classes.logoutIcon}
              />
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
