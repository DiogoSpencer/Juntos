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
      <div className={classes.subject}>
        <label className={classes.subTitle}>
          Seleciona o tipo de ponto:
          <select
            value={props.markerType}
            onChange={props.handleMarkerChange}
            className={classes.selectSub}
          >
            <option value="MARKER">Percurso</option>
            <option value="DANGER">Perigo</option>
            <option value="INTEREST">Interesse</option>
          </select>
        </label>
      </div>
      <div className={classes.subContainer}>
        <label className={classes.subTitle} htmlFor="difficulty">
          Exigência Física:
        </label>
        <input
          type="number"
          id="difficulty"
          value={props.enteredDifficulty}
          onChange={props.difficultyChangeHandler}
          onBlur={props.difficultyBlurHandler}
          min="1"
          max="5"
        />
        {props.difficultyHasError && (
          <p className={classes.inputError}>
            Por favor insira um nível de exigência física de 1 (menos exigente)
            - 5 (mais exigente).
          </p>
        )}
      </div>
      <div>
        <p className={classes.subTitle}>
          Distância Total Aproximada: <span>{props.distance / 1000} KM</span>
        </p>
      </div>
    </div>
  );
};

export default MapDetails;

/*
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

*/
