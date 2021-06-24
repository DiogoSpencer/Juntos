import { Link } from "react-router-dom";
import IconButton from "../UI/IconButton";
import entrar from "../../img/entrar.jpg";
import inicial from "../../img/inicial.jpg";
import registar from "../../img/registar.jpg";
import classes from "./AppHome.module.css";

const AppHome = () => {
  return (
    <div id="app" className={classes.mainApp}>
      <h3 className={classes.imgText1}>
        <span className={classes.numbers}>1.</span> Começa por criar uma conta
      </h3>
      <img
        className={`${classes.appImage} ${classes.divImage1}`}
        src={inicial}
        alt="App Preview Register"
      />
      <h3 className={classes.imgText2}>
        <span className={classes.numbers}>2.</span> Vê quem precisa de ajuda ou <br/>oferece ajuda perto de ti
      </h3>
      <img
        className={`${classes.appImage} ${classes.divImage2}`}
        src={entrar}
        alt="App Preview Register"
      />
      <h3 className={classes.imgText3}>
        <span className={classes.numbers}>3.</span> Começa por criar uma conta
      </h3>
      <img
        className={`${classes.appImage} ${classes.divImage3}`}
        src={registar}
        alt="App Preview Register"
      />
      <div className={classes.appText}>
        <p>Ajudar alguém? Precisas de ajuda? Doar roupas de criança?</p>
        <Link className={classes.appLink} to="/app">
          Vê aqui o que podemos fazer <span className={classes.juntos}>juntos</span>
        </Link>
        <div className={classes.appButton}>
          <IconButton text="Descarrega Aqui!" />
        </div>
      </div>
    </div>
  );
};

export default AppHome;
