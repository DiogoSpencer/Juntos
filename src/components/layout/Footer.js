import { Link } from "react-router-dom";
import classes from "./Footer.module.css";
import facebook from "../../img/facebook.png";
import instagram from "../../img/instagram.png";

const Footer = () => {
  return (
    <div className={classes.footer}>
      <Link to="/Contactos" className={classes.contactos}>
        Contactos
      </Link>
      <div className={classes.social}>
        <p>Redes Sociais</p>
        <Link
          to={{ pathname: "https://www.facebook.com/" }}
          target="_blank"
        >
          <img src={facebook} alt="facebook-link"/>
        </Link>
        <Link
          to={{ pathname: "https://www.instagram.com/" }}
          target="_blank"
        >
          <img src={instagram} alt="instagram-link"/>
        </Link>
      </div>
      <p className={classes.weHelp}>
        <span className={classes.juntos}>juntos</span> WeHelp
      </p>
    </div>
  );
};

export default Footer;
