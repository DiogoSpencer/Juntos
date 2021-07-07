import classes from "./UserDisplay.module.css";
import helpIcon from "../../img/logo.png";
import avatarIcon from "../../img/userblue.png";
import { Link } from "react-router-dom";

const UserDisplay = (props) => {
  return (
    <div className={classes.container}>
      {props.isAnonimous ? (
        <img
          src={avatarIcon}
          alt="imagem-perfil"
          className={classes.profileImg}
        />
      ) : (
        <Link
          to={`/verperfil/${props.username}`}
          className={classes.profileImg}
        >
          {props.profileImg ? (
            <img
              src={props.profileImg}
              alt="imagem-perfil"
              className={classes.profileImg}
            />
          ) : (
            <img
              src={avatarIcon}
              alt="imagem-perfil"
              className={classes.profileImg}
            />
          )}
        </Link>
      )}
      <div className={classes.nameContainer}>
        {props.isAnonimous ? (
          <p>{props.firstName}</p>
        ) : (
          <p>
            {props.firstName} {props.lastName}
          </p>
        )}
      </div>

      <div className={classes.numHelps}>
        <img src={helpIcon} alt="número-ajudas" />
        <p>{props.numHelps}</p>
      </div>
    </div>
  );
};

export default UserDisplay;
