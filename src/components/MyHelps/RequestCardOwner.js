import helpIcon from "../../img/logo.png";
import markerIcon from "../../img/marker_red.png";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import classes from "./RequestCardOwner.module.css";

const RequestCardOwner = (props) => {
  const typeHandler = (type) => {
    switch (type) {
      case "OFFER_HELP":
        return offerHelpIcon;
      case "REQUEST_HELP":
        return requestHelpIcon;
      case "DONATE":
        return donateIcon;
      case "ACTION":
        return actionIcon;
    }
  };

  return (
    <div className={classes.container}>
      <img
        src={actionIcon}
        alt="imagem-perfil"
        className={classes.profileImg}
      />
      <div className={classes.userInfo}>
        <p>Nome Apelido</p>

        <p>
          <img src={helpIcon} alt="número-ajudas" />
          NumAjudas
        </p>
      </div>
      <h3 className={classes.title}>{props.title}</h3>
      <div className={classes.markerInfo}>
        <img src={markerIcon} />
        <p>Distancia-aqui</p>
      </div>
      <div className={classes.requestInfo}>
        <p>{props.creationDate}</p>
        <img src={actionIcon} alt="tipo-pedido" />
      </div>
    </div>
  );
};

export default RequestCardOwner;
