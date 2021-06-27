import { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./SideBar.module.css";
import iconList from "../../img/downorange.png";
import close from "../../img/uporange.png";
import novaIcon from "../../img/add.png";
import chatIcon from "../../img/chat.png";
import minhasIcon from "../../img/help.png";
import mapIcon from "../../img/map.png";
import ajudasIcon from "../../img/list.png";
import backofficeIcon from "../../img/settings.png";
import { useSelector } from "react-redux";

const SideBar = () => {
  const userRole = useSelector((state) => state.auth.role);
  const [show, setShow] = useState(false);

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
          <Link to="/novopedido">
            <img
              src={novaIcon}
              alt="nova-ajuda-pedido"
              className={classes.navIcon}
            />
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link to="/conversas">
            <img src={chatIcon} alt="conversas" className={classes.navIcon} />
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link to="/minhasajudas">
            <img
              src={minhasIcon}
              alt="minhas-ajudas"
              className={classes.navIcon}
            />
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link to="/home">
            <img src={mapIcon} alt="mapa" className={classes.navIcon} />
          </Link>
        </li>
        <li className={classes.navItem}>
          <Link to="/ajudas">
            <img src={ajudasIcon} alt="ajudas" className={classes.navIcon} />
          </Link>
        </li>
        {checkRole(userRole) && (
          <li>
            <Link to="/home">
              <img
                src={backofficeIcon}
                alt="backend"
                className={classes.navIcon}
              />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );

  return (
    <div className={classes.navigation}>
      <img
        src={show ? close : iconList}
        alt="sidebar-show-hide"
        className={classes.iconList}
        onClick={hideSideBarHandler}
      />
      {show && sideBarStyle}
    </div>
  );
};

export default SideBar;

/*
      <img
        src={iconList}
        alt="sidebar-show-hide"
        className={classes.iconList}
        onClick={hideSideBarHandler}
      />
            {show && sideBar}
*/
