import { Link } from "react-router-dom";
import classes from "./ParticipantItem.module.css";

const PartcipantItem = (props) => {
  return (
    <Link to={`\verperfil\${props.username}`} className={classes.container}>
      <img
        src={props.profileImg}
        alt="imagem-participante"
        className={classes.profileImg}
      />
      <p className={classes.names}>
        {props.firstName} {props.lastName}
      </p>
    </Link>
  );
};

export default PartcipantItem;
