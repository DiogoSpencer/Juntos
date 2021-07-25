import { Link } from "react-router-dom";
import classes from "./HeroisHome.module.css";
import { Fragment } from "react";

//falta fetch data herois do mes
//se calhar op que vai buscar so os 3 mais recentes?
//se nao o home poderia demorar mt tempo a carregar

const HeroisHome = (props) => {
  return (
    <div id="herois" className={classes.mainHeroisHome}>
      <h1 className={classes.mainHeroisTitle}>
        Nem Todos os Heróis Vestem Capas
      </h1>
      {props.heroes && props.heroes.length === 3 && (
        <Fragment>
          <Link
            to={`/herois/${props.heroes[0].heroId}`}
            className={classes.linkHerois1}
          >
            <img
              src={props.heroes[0].img}
              alt="Heroi-do-mes-1"
              className={classes.heroisImg}
            />
            <br />
            {props.heroes[0].firstName} {props.heroes[0].lastName}
          </Link>
          <Link
            to={`/herois/${props.heroes[1].heroId}`}
            className={classes.linkHerois2}
          >
            <img
              src={props.heroes[1].img}
              alt="Heroi-do-mes-2"
              className={classes.heroisImg}
            />
            <br />
            {props.heroes[1].firstName} {props.heroes[1].lastName}
          </Link>
          <Link
            to={`/herois/${props.heroes[2].heroId}`}
            className={classes.linkHerois3}
          >
            <img
              src={props.heroes[2].img}
              alt="Heroi-do-mes-3"
              className={classes.heroisImg}
            />
            <br />
            {props.heroes[2].firstName} {props.heroes[2].lastName}
          </Link>
        </Fragment>
      )}
    </div>
  );
};

export default HeroisHome;

//TODO: links dinamicos com id + fetch data dos herois (3 ultimos)
//Talvez slideshow aqui
