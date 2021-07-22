import { Link } from "react-router-dom";
import classes from "./ParticipantItem.module.css";
import juntosIcon from "../../img/logo.png";
import verifiedIcon from "../../img/verified.png";
import userIcon from "../../img/userblue.png";

const PartcipantItem = (props) => {
  return (
    <Link to={`/juntos/verperfil/${props.username}`} className={classes.container}>
      {props.profileImg ? (
        <img
          src={props.profileImg}
          alt="imagem-perfil"
          className={classes.profileImg}
        />
      ) : (
        <img
          src={userIcon}
          alt="imagem-perfil"
          className={classes.profileImg}
        />
      )}
      <div className={classes.userInfo}>
        <p>
          <img src={juntosIcon} alt="número-ajudas" />
          {props.numHelps}
        </p>
      </div>
      <div className={classes.names}>
        <p>
          {props.firstName} {props.lastName}
        </p>
        {props.company && (
          <img
            src={verifiedIcon}
            alt="organizacao-verificada"
            className={classes.verifiedIcon}
          />
        )}
      </div>
    </Link>
  );
};

export default PartcipantItem;
