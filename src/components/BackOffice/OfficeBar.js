import homeIcon from "../../img/home.png";
import appEngIcon from "../../img/appEng.png";
import buildingIcon from "../../img/building.png";
import notificationsIcon from "../../img/notifications.png";
import pointsIcon from "../../img/points.png";
import usersIcon from "../../img/users.png";
import reportOfficeIcon from "../../img/reportoffice.png";
import emailIcon from "../../img/email.png";
import classes from "./OfficeBar.module.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Fragment } from "react";

const show = true;

const OfficeBar = () => {
  const userRole = useSelector((state) => state.auth.role);

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
        <li className={classes.navItem}>
          <Link to="/backoffice/appEng">
            <img
              src={appEngIcon}
              alt="app-engine"
              className={classes.navIcon}
            />
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
              <Link to="/backoffice/organizacoes">
                <img
                  src={buildingIcon}
                  alt="organizacoes"
                  className={classes.navIcon}
                />
              </Link>
            </li>
            <li className={classes.navItem}>
              <Link to="/backoffice/reportes">
                <img
                  src={reportOfficeIcon}
                  alt="reportes"
                  className={classes.navIcon}
                />
              </Link>
            </li>
            <li className={classes.navItem}>
              <Link to="/backoffice/tickets">
                <img src={emailIcon} alt="clock" className={classes.navIcon} />
              </Link>
            </li>
          </Fragment>
        )}
      </ul>
    </nav>
  );

  return <div className={classes.navigation}>{show && sideBarStyle}</div>;
};

export default OfficeBar;