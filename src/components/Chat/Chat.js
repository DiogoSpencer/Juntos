import { Fragment, useState } from "react";
import RequestChatList from "./ResquestChatList";
import OfferChatList from './OfferChatList'
import SideButtons from "../UI/SIdeButtons";

const Chat = () => {
  const [showPedido, setShowPedido] = useState(true);

  const pedidoHandler = () => {
    setShowPedido(true);
  };

  const ajudaHandler = () => {
    setShowPedido(false);
  };

  return (
    <Fragment>
      <h1>Mensagens</h1>
      <div>
        <SideButtons
          button1="Pedidos"
          button2="Ajudas"
          onClick1={pedidoHandler}
          onClick2={ajudaHandler}
        />
      </div>
      <div>
          {showPedido && <RequestChatList />}
          {!showPedido && <OfferChatList />}
      </div>
    </Fragment>
  );
};

export default Chat;
