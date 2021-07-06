import { useEffect, useState } from "react";
import Button from "../UI/Button";
import CommentList from "./CommentList";
import HelpTitle from "./HelpTitle";
import ImageDisplay from "./ImageDisplay";
import ShareHelp from "./ShareHelp";
import UserDisplay from "./UserDisplay";
import { Route, Link, useRouteMatch } from "react-router-dom";
import classes from "./HelpDetails.module.css";
import { markerDetails } from "../../services/http";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import LoadingSpinner from "../UI/LoadingSpinner";

const HelpDetails = (props) => {
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const match = useRouteMatch();
  const helpId = match.params.requestId;

  useEffect(() => {
    setIsLoading(true);
    markerDetails(helpId).then(
      (response) => {
        console.log(response.data);
        setResponseData(response.data);
      },
      (error) => {
        console.log(error);
        setIsLoading(false);
      }
    );
  }, [helpId]);

  useEffect(() => {
    setIsLoading(false);
  }, [responseData]);

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

  //ir buscar id atraves do url -> fazer pedido ao servidor com esse id
  return (
    <div className={classes.mainContainer}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        <h1 className={classes.title}>
          <img src={typeHandler(responseData.type)} alt={responseData.type} />
          {responseData.title}
        </h1>
        <div className={classes.mapContent} id="MAPA_AQUI">MAPA_AQUI</div>
        <div className={classes.infoContent}>
          <HelpTitle
            title={responseData.title}
            helpType={responseData.type}
            creationDate={responseData.creationDate}
          />
          <UserDisplay />
          <ImageDisplay images={responseData.photoGalery} />
          <ShareHelp />
          <Button text={props.buttonText} />
        </div>
        <div className={classes.commentContent}>
          <Route path={match.path} exact>
            <div>
              <Link to={`${match.url}/comentarios`}>Carregar Comentários</Link>
            </div>
          </Route>
          <Route path={`${match.path}/comentarios`}>
            <CommentList />
          </Route>
        </div>
      </div>
    </div>
  );
};

export default HelpDetails;
//estamos a carregar comments dentro de uma route para nao termos que os ter la diretamente
//assim so carregamos se user quiser ver os comments, salva-nos um pedido ao server que ate
//podera ser enorme.
//ter link dentro de route faz com que o react router faça desaparecer o link
