import classes from "./MapHelpDetails.module.css";

const MapHelpDetails = (props) => {
  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <p className={classes.title}>Detalhes da Ação</p>
      </div>
      <div className={classes.moveMode}>
        <label htmlFor="move" className={classes.subTitle}>
          Modo de Deslocamento:
        </label>
        <select
          id="move"
          value={props.move}
          onChange={props.handleMove}
          className={classes.selectButton}
        >
          <option value="WALKING">Andar</option>
          <option value="DRIVING">Conduzir</option>
        </select>
      </div>
      <div className={classes.distanceContainer}>
        <p>
          <span className={classes.subTitle}>Distância:</span>
          <p></p>
          <span className={classes.number}>{props.distance / 1000} km</span>
        </p>
      </div>
      <div className={classes.volunteersContainer}>
        <p className={classes.subTitle}>Voluntários:</p>
        <p className={classes.number}>
          {props.currentHelpers} de {props.volunteers}
        </p>
      </div>
      <div className={classes.difficultyContainer}>
        <p className={classes.subTitle}>Exigência Física (1-5):</p>
        <p className={classes.number}>{props.difficulty}</p>
      </div>
    </div>
  );
};

export default MapHelpDetails;
