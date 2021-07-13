import classes from "./HelpTitle.module.css";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;

const HelpTitle = (props) => {
  const formatDate = (longDate) => {
    const now = new Date(Date.now());
    const date = new Date(longDate);

    const nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const serverDate = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffInDays = Math.floor((nowDate - serverDate) / MS_PER_DAY);
    if (diffInDays < 1) {
      const hours = Math.abs(now - date) / MS_PER_HOUR;
      const minutes = Math.abs(now - date) / MS_PER_MINUTE;
      const roundedHours = Math.round(hours);
      const roundedMinutes = Math.round(minutes);

      if (roundedHours === 24) {
        return `${diffInDays} dia atrás`;
      } else if (hours < 1) {
        return `${minutes < 1 ? 1 : roundedMinutes} ${
          roundedMinutes <= 1 ? "minuto" : "minutos"
        } atrás`;
      } else if (roundedHours > hours) {
        return `< ${roundedHours} ${
          roundedHours === 1 ? "hora" : "horas"
        } atrás`;
      } else if (roundedHours < hours) {
        return `> ${roundedHours} ${
          roundedHours === 1 ? "hora" : "horas"
        } atrás`;
      } else {
        return `${roundedHours} ${roundedHours === 1 ? "hora" : "horas"} atrás`;
      }
    } else {
      return `${diffInDays} dias atrás`;
    }
  };

  const typeHandler = (type) => {
    switch (type) {
      case "HELP_OFFER":
        return "Oferta de Ajuda";
      case "HELP_REQUEST":
        return "Pedido de Ajuda";
      case "DONATE":
        return "Doar";
      case "ACTION":
        return "Ação";
    }
  };

  const typeIconHandler = (type) => {
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
      <h3 className={classes.title}>{props.title}</h3>
      <div className={classes.requestContainer}>
        <p className={classes.type}>{typeHandler(props.helpType)}</p>
        <p className={classes.creationDate}>{formatDate(props.creationDate)}</p>
      </div>
      {props.helpType === "ACTION" && (
        <div className={classes.volunteersContainer}>
          <p className={classes.type}>Voluntários:</p>
          <p className={classes.number}>{props.currentHelpers} de {props.volunteers}</p>
        </div>
      )}
      {props.helpType === "ACTION" && (
        <div className={classes.difficultyContainer}>
          <p className={classes.type}>Exigência Física:</p>
          <p className={classes.number}>{props.difficulty}</p>
        </div>
      )}
      <img
        src={typeIconHandler(props.helpType)}
        alt={typeHandler(props.helpType)}
        className={classes.helpType}
      />
    </div>
  );
};

export default HelpTitle;
