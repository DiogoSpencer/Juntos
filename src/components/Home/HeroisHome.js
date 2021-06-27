import { Link } from "react-router-dom";
import oceanSaving from "../../img/oceanSaving.jpg";
import boxesVolunteer from "../../img/boxesVolunteer.jpg";
import foodVolunteer from "../../img/foodVolunteer.jpg";
import classes from "./HeroisHome.module.css";

//falta fetch data herois do mes
//se calhar op que vai buscar so os 3 mais recentes?
//se nao o home poderia demorar mt tempo a carregar

const HeroisHome = () => {
  return (
    <div id="herois" className={classes.mainHeroisHome}>
      <h1 className={classes.mainHeroisTitle}>
        Nem Todos os Heróis Vestem Capas
      </h1>
      <Link to="/herois/heroi1" className={classes.linkHerois1}>
        <img
          src={boxesVolunteer}
          alt="Heroi-do-mes-1"
          className={classes.heroisImg}
        />
        <br/>
        Nome Héroi 1
      </Link>
      <Link to="/herois/heroi2" className={classes.linkHerois2}>
        <img
          src={oceanSaving}
          alt="Heroi-do-mes-2"
          className={classes.heroisImg}
        />
        <br/>
        Nome Héroi 2
      </Link>
      <Link to="/herois/heroi3" className={classes.linkHerois3}>
        <img
          src={foodVolunteer}
          alt="Heroi-do-mes-3"
          className={classes.heroisImg}
        />
        <br/>
        Nome Héroi 3
      </Link>
    </div>
  );
};

export default HeroisHome;

//TODO: links dinamicos com id + fetch data dos herois (3 ultimos)
//Talvez slideshow aqui
