import SideButtons from "../UI/SideButtons";
import classes from "./Anonimous.module.css";
import avatarIcon from "../../img/userblue.png";
import helpIcon from "../../img/logo.png";

const Anonimous = (props) => {
  const showAnonimous = (
    <div className={classes.anonimousDiv}>
      <img src={avatarIcon} alt="anonimo" className={classes.avatar} />
      <p className={classes.name}>Primeiro Nome</p>
    </div>
  );

  //show picture from store
  const showPerson = (
    <div className={classes.anonimousDiv}>
      <img src="" alt="imagem-perfil-utilizador" className={classes.avatar} />
    </div>
  );

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>Queres Ficar Anónimo?</h3>
      <p className={classes.text}>Queres esconder a tua foto e último nome?</p>
      <div className={classes.buttons}>
        <SideButtons
          button1="Sim"
          button2="Não"
          onClick1={props.yesAnonimous}
          onClick2={props.noAnonimous}
        />
      </div>
      {props.anonimous && showAnonimous}
      {!props.anonimous && showPerson}
      <div className={classes.userInfo}>
        <img src={helpIcon} alt="helps" className={classes.helpIcon} />
        <p className={classes.numHelps}>numHelps</p>
      </div>
    </div>
  );
};

export default Anonimous;
