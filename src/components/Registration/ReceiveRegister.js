import classes from "./ReceiveRegister.module.css";
import juntosIcon from "../../img/logo.png";
import { useRouteMatch } from "react-router";
import { useEffect, useState } from "react";
import { activateAccount } from "../../services/http";
import LoadingSpinner from "../UI/LoadingSpinner";

const ReceiveRegister = () => {
  const match = useRouteMatch();
  const urlCode = match.params.code;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    activateAccount(urlCode).then(
      (response) => {
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
      }
    );
  }, [urlCode]);

  return (
    <div className={classes.mainContent}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.completeDiv}>
        <h1 className={classes.completeTitle}>
          Olá, a tua conta foi activada com sucesso!
        </h1>
        <img
          src={juntosIcon}
          alt="juntos-icon"
          className={classes.completeImg}
        />
        <p className={classes.completeText}>Agora já podes começar a ajudar</p>
      </div>
    </div>
  );
};

export default ReceiveRegister;
