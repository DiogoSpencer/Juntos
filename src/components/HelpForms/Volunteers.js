import SideButtons from "../UI/SideButtons";

const Volunteers = (props) => {
  const numberVolunteers = (
    <div>
      <input
        type="number"
        id="numberVolunteers"
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        min="1"
        max="10"
      />
      {props.error && <p>Por favor insira um número de voluntários entre 1 e 10.</p>}
    </div>
  );

  return (
    <div>
      <h3>Precisas de Voluntários para este Percurso?</h3>
      <SideButtons
        button1="Sim"
        button2="Não"
        onClick1={props.yesVolunteers}
        onClick2={props.noVolunteers}
      />
      {props.volunteersValue && numberVolunteers}
    </div>
  );
};

export default Volunteers;
