import IconButton from "../UI/IconButton";
import AppCard from "./AppCard";
import registarApp from "../../img/registar.jpg";
import inicialApp from "../../img/inicial.jpg";
import entrarApp from "../../img/entrar.jpg";
import classes from "./AppPage.module.css";

const AppPage = () => {
  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.title}>Sobre a App</h1>
      <div className={classes.appCards}>
        <AppCard
          text="Começa por criar uma conta"
          img={registarApp}
          alt="app-criar-conta"
        />
        <AppCard
          text="Aqui podes ver todos os pedidos de ajuda."
          img={inicialApp}
          alt="app-pedidos-ajuda"
        />
        <AppCard
          text="Aqui podes fazer um novo pedido"
          img={entrarApp}
          alt="app-novo-pedido"
        />
      </div>
      <div className={classes.description}>
        <p>Instala a nossa app e começa a ajudar!</p>
        <p>Podes fazer pedidos de Ajuda ou oferecer Ajuda.</p>
        <p>Podes criar ou participar em ações de voluntariado.</p>
      </div>
      <div className={classes.iconButton}>
        <IconButton />
      </div>
    </div>
  );
};

export default AppPage;
//TODO: Descriçao
