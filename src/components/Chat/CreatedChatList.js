import { Link } from "react-router-dom";
import ChatItem from "./ChatItem";
import { useRouteMatch } from "react-router-dom";
import classes from "./CreatedChatList.module.css";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import verifiedIcon from "../../img/verified.png";
import greenCircle from "../../img/green-circle.png";
import redCircle from "../../img/red-circle.png";

const offerChat = [
  {
    id: 1,
    title: "dar comida ao gato",
    status: "active",
    userEmail: "asd@hotmail.com",
    userFistName: "dan",
    userLastName: "sss",
    ownerEmail: "ddd@hotmail.com",
  },
];
//falta foto, data etc...
//quando clica vai estabelecer a conexao websocket e vai buscar o historico de mensagens

const CreatedChatList = (props) => {
  const match = useRouteMatch();

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
      default:
    }
  };

  return (
    <div className={classes.container}>
      <ul>
        {offerChat.map((offer) => (
          <li key={offer.id}>
            <Link to={`${match.path}/ofertas/${offer.id}`}>
              <ChatItem
                title={offer.title}
                status={offer.status}
                name={offer.userFistName + " " + offer.userLastName}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreatedChatList;
