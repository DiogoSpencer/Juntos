import classes from "./MapDetails.module.css";

const MapDetails = (props) => {
  /*FALTA:
  - coordenadas gps
  - representaçao dos pontos de açao e representaçao de pontos de interesse colateral
  - info nos apontadores
  - zonas de risco
  - meter a gestão de estados a nivel do pai
  - ter dificuldade de 1 a 5
  */

  return (
    <div>
      <div>
        <label htmlFor="distance">Distância Total Aproximada:</label>
        <input
          type="text"
          id="distance"
          value={props.enteredDistance}
          onChange={props.distanceChangeHandler}
          onBlur={props.distanceBlurHandler}
        />
        {props.distanceHasError && (
          <p className={classes.infoError}>
            Por favor insira uma distância total aproximada.
          </p>
        )}
      </div>
      <div>
        <label htmlFor="difficulty">Exigência Física:</label>
        <input
          type="text"
          id="difficulty"
          value={props.enteredDifficulty}
          onChange={props.difficultyChangeHandler}
          onBlur={props.difficultyBlurHandler}
        />
        {props.difficultyHasError && (
          <p className={classes.infoError}>
            Por favor insira um nível de dificuldade de 1 (menos exigente) - 5
            (mais exigente).
          </p>
        )}
      </div>
    </div>
  );
};

export default MapDetails;
