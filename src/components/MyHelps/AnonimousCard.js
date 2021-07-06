import avatarIcon from "../../img/userblue.png";
import helpIcon from "../../img/logo.png";
import markerIcon from "../../img/marker_red.png";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import classes from "./AnonimousCard.module.css";

const AnonimousCard = (props) => {
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
    <div
      className={`${classes.container} ${
        props.isActive ? "" : classes.inactiveRequest
      }`}
    >
      <img
        src={avatarIcon}
        alt="pedido-anónimo"
        className={classes.profileImg}
      />
      <div className={classes.userInfo}>
        <p>{props.firstName}</p>

        <p>
          <img src={helpIcon} alt="número-ajudas" />
          {props.numHelps}
        </p>
      </div>
      <h3 className={classes.title}>{props.title}</h3>
      <div className={classes.markerInfo}>
        <img src={markerIcon} />
        <p>Distancia-aqui</p>
      </div>
      <div className={classes.requestInfo}>
        <p>{props.creationDate}</p>
        <img src={typeHandler(props.type)} alt={props.type} />
      </div>
    </div>
  );
};

export default AnonimousCard;
