import SideButtons from "../UI/SideButtons";
import classes from "./Anonimous.module.css";
import avatarIcon from "../../img/userblue.png";
import helpIcon from "../../img/logo.png";
import { useSelector } from "react-redux";
import userIcon from "../../img/userblue.png";

const Anonimous = (props) => {
  const profileImg = useSelector((state) => state.auth.profileImg);
  const firstName = useSelector((state) => state.auth.firstName);
  const lastName = useSelector((state) => state.auth.lastName);
  const numHelps = useSelector((state) => state.auth.numHelps);

  const showAnonimous = (
    <div className={classes.anonimousDiv}>
      <img src={avatarIcon} alt="anonimo" className={classes.avatar} />
      <p className={classes.name}>{firstName}</p>
    </div>
  );

  //show picture from store
  const showPerson = (
    <div className={classes.anonimousDiv}>
      {profileImg ? (
        <img
          src={profileImg}
          alt="imagem-perfil-utilizador"
          className={classes.avatar}
        />
      ) : (
        <img
          src={userIcon}
          alt="imagem-perfil-utilizador"
          className={classes.avatar}
        />
      )}
      <p className={classes.name}>
        {firstName} {lastName}
      </p>
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
          isButton1={props.anonimous}
        />
      </div>
      {props.anonimous && showAnonimous}
      {!props.anonimous && showPerson}
      <div className={classes.userInfo}>
        <img src={helpIcon} alt="helps" className={classes.helpIcon} />
        <p className={classes.numHelps}>{numHelps}</p>
      </div>
    </div>
  );
};

export default Anonimous;
