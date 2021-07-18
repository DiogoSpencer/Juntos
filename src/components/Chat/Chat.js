import { useEffect, useState } from "react";
import ParticipationChatList from "./ParticipationChatList";
import CreatedChatList from "./CreatedChatList";
import SideButtons from "../UI/SideButtons";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Chat.module.css";

//Página de Rosto
const Chat = () => {
  const [isCreated, setIsCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    //get List of open chats
    if (refresh) {
      setIsLoading(true);
    }
  }, [refresh]);

  useEffect(() => {
    setRefresh(false);
    setIsLoading(false);
  }, [responseData, errorMsg]);

  const pedidoHandler = () => {
    setIsCreated(true);
  };

  const ajudaHandler = () => {
    setIsCreated(false);
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Mensagens</h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        <div>
          <SideButtons
            button1="Pedidos"
            button2="Ajudas"
            onClick1={pedidoHandler}
            onClick2={ajudaHandler}
          />
        </div>
        <div>
          {isCreated && <CreatedChatList />}
          {!isCreated && <ParticipationChatList />}
        </div>
      </div>
    </div>
  );
};

export default Chat;
