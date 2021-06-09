import { Fragment } from "react";
import AndroidButton from "../UI/AndroidButton";
import AppCard from "./AppCard";

const AppPage = () => {
  return (
    <Fragment>
      <h1>Sobre a App</h1>
      <AppCard text="Começa por criar uma conta" img="" alt="app-criar-conta" />
      <AppCard
        text="Aqui podes ver todos os pedidos de ajuda."
        img=""
        alt="app-pedidos-ajuda"
      />
      <AppCard
        text="Aqui podes fazer um novo pedido"
        img=""
        alt="app-novo-pedido"
      />
      <div>
        <p>Instala a nossa app e começa a ajudar!</p>
        <p>Podes fazer pedidos de Ajuda ou oferecer Ajuda.</p>
        <p>Podes criar ou participar em ações de voluntariado.</p>
        <p>Podes seguir o mapa em modo offline</p>
      </div>
      <AndroidButton />
    </Fragment>
  );
};

export default AppPage;
//TODO: Descriçao