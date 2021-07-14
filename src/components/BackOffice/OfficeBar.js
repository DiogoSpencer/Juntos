import homeIcon from "../../img/home.png";
import clockIcon from "../../img/clock.png";
import notificationsIcon from "../../img/notifications.png";
import pointsIcon from "../../img/points.png";
import usersIcon from "../../img/users.png";
import classes from "./OfficeBar.module.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Fragment } from "react";

const OfficeBar = () => {
  const userRole = useSelector((state) => state.auth.role);
  const [show, setShow] = useState(true); //deve começar a false se meter seta para abrir

  const hideSideBarHandler = () => {
    setShow((prevState) => !prevState);
  };

  const checkRole = (role) => {
    if (role === "ADMIN" || role === "MOD") {
      return true;
    }
    return false;
  };

  const sideBarStyle = (
    <nav className={classes.nav}>
      <ul className={classes.navList}>
        <li className={classes.navItem}>
          <Link to="/backoffice">
            <img src={homeIcon} alt="home" className={classes.navIcon} />
          </Link>
        </li>
        {checkRole(userRole) && (
          <Fragment>
            <li className={classes.navItem}>
              <Link to="/backoffice/utilizadores">
                <img src={usersIcon} alt="Users" className={classes.navIcon} />
              </Link>
            </li>
            <li className={classes.navItem}>
              <Link to="/backoffice/pedidos">
                <img
                  src={pointsIcon}
                  alt="Pedidos"
                  className={classes.navIcon}
                />
              </Link>
            </li>
            <li className={classes.navItem}>
              <Link to="/backoffice/notificacoes">
                <img
                  src={notificationsIcon}
                  alt="notificacoes"
                  className={classes.navIcon}
                />
              </Link>
            </li>
            <li className={classes.navItem}>
              <Link to="/backoffice/clock">
                <img src={clockIcon} alt="clock" className={classes.navIcon} />
              </Link>
            </li>
          </Fragment>
        )}
      </ul>
    </nav>
  );

  return (
    <div className={classes.navigation}>
      {show && sideBarStyle}
    </div>
  );
};

export default OfficeBar;

// barra/menu que vai ficar a direita quando se entra no backoffice para escolher operações de users, pedidos, administração, etc...


/*
      <img
        src={show ? close : iconList}
        alt="sidebar-show-hide"
        className={classes.iconList}
        onClick={hideSideBarHandler}
      />

*/