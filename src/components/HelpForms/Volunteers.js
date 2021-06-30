import SideButtons from "../UI/SideButtons";
import classes from "./Volunteers.module.css"

const Volunteers = (props) => {
  const numberVolunteers = (
    <div className={classes.subContainer}>
      <p className={classes.subTitle}>Quantos Voluntários Precisas?</p>
      <input
        type="number"
        id="numberVolunteers"
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        min="1"
        max="10"
      />
      {props.error && <p className={classes.inputError}>Por favor insira um número de voluntários entre 1 e 10.</p>}
    </div>
  );

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>Precisas de Voluntários para este Percurso?</h3>
      <div className={classes.buttonContainer}>
      <SideButtons
        button1="Sim"
        button2="Não"
        onClick1={props.yesVolunteers}
        onClick2={props.noVolunteers}
      />
      </div>
      {props.volunteersValue && numberVolunteers}
    </div>
  );
};

export default Volunteers;
