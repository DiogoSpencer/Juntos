import { Link } from "react-router-dom";
import classes from "./Agradecimentos.module.css";
import heart from "../../img/heart.png"
import nova from "../../img/nova_4.png"


const Agradecimentos = () => {
  //todos estes divs vao ser links para paginas dos parceiros
  return (
    <div id="parceiros" className={classes.mainParceiros}>
      <h1 className={classes.mainTitle}>Agradecimentos</h1>
      <p className={classes.descriptionTextParceiros}>
        Estes são os nossos parceiros, sem eles não estaríamos{" "}
        <span className={classes.juntos}>juntos</span>
      </p>
      <div className={classes.allLogos1}>
        <div className={classes.logo}>
          <img src={nova} alt="logo-1" className={classes.logoImg} />
        </div>
        <div className={classes.logo}>
          <img src={nova} alt="logo-1" className={classes.logoImg} />
        </div>
        <div className={classes.logo}>
          <img src={nova} alt="logo-1" className={classes.logoImg} />
        </div>
      </div>
      <div className={classes.allLogos2}>
        <div className={classes.logo}>
          <img src={nova} alt="logo-2" className={classes.logoImg} />
        </div>
        <div className={classes.logo}>
          <img src={nova} alt="logo-2" className={classes.logoImg} />
        </div>
        <div className={classes.logo}>
          <img src={nova} alt="logo-2" className={classes.logoImg} />
        </div>
      </div>
      <div className={classes.thanks}>
        <h3 className={classes.thanksText}>Obrigado</h3>
        <img src={heart} alt="heart" className={classes.heartImg} />
      </div>
      <Link to="/Juntar" className={classes.joinLink}>
        Junta-te a Nós
      </Link>
    </div>
  );
};

export default Agradecimentos;
