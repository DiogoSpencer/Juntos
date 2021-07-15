import helpIcon from "../../img/logo.png";
import markerIcon from "../../img/marker_red.png";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import classes from "./RequestCardOwner.module.css";
import userIcon from "../../img/userblue.png";
import verifiedIcon from "../../img/verified.png";
import greenCircle from "../../img/green-circle.png";
import redCircle from "../../img/red-circle.png";

const RequestCardOwner = (props) => {
  const typeHandler = (type) => {
    switch (type) {
      case "HELP_OFFER":
        return offerHelpIcon;
      case "HELP_REQUEST":
        return requestHelpIcon;
      case "DONATE":
        return donateIcon;
      case "ACTION":
        return actionIcon;
    }
  };

  return (
    <div className={classes.container}>
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
          {props.firstName} {props.lastName}
        </p>

        <p>
          <img src={helpIcon} alt="número-ajudas" />
          {props.numHelps}
          {props.company && (
            <img
              src={verifiedIcon}
              alt="organizacao-verificada"
              className={classes.verifiedIcon}
            />
          )}
        </p>
      </div>
      <h3 className={classes.title}>{props.title}</h3>
      <div className={classes.markerInfo}>
        <img
          src={markerIcon}
          className={classes.markerInfoImg}
          alt="localizacao"
        />
        <p>{props.location}</p>
      </div>
      <div className={classes.activeInfo}>
        {props.isActive ? (
          <img
            src={greenCircle}
            className={classes.requestCircle}
            alt="pedido-activo"
          />
        ) : (
          <img
            src={redCircle}
            className={classes.requestCircle}
            alt="pedido-inactivo"
          />
        )}
      </div>
      <div className={classes.requestInfo}>
        <p>{props.creationDate}</p>
        <img src={typeHandler(props.type)} alt={props.type} />
      </div>
    </div>
  );
};

export default RequestCardOwner;
