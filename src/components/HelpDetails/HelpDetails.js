import { useEffect, useState } from "react";
import Button from "../UI/Button";
import CommentList from "./CommentList";
import HelpTitle from "./HelpTitle";
import ImageDisplay from "./ImageDisplay";
//import ShareHelp from "./ShareHelp";
import UserDisplay from "./UserDisplay";
import { Route, Link, useRouteMatch, useHistory } from "react-router-dom";
import classes from "./HelpDetails.module.css";
import { markerDetails } from "../../services/http";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import InputPassword from "./InputPassword";
import gS from "../../services/generalServices.json";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/session/auth";
import { deleteMarker } from "../../services/http";

const HelpDetails = (props) => {
  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const history = useHistory();
  const match = useRouteMatch();
  const helpId = match.params.requestId;

  const loggedUsername = useSelector((state) => state.auth.username);

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
        if (error.status === 401) {
          alert("Sessão expirou");
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
        }
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

  const deleteRequestHandler = () => {
    if (
      window.confirm(
        "Tem a certeza que pretende apagar este pedido? Esta ação é irreversível."
      )
    ) {
      setIsLoading(true);
      deleteMarker(helpId).then(
        (response) => {
          setIsLoading(false);
          history.replace("/minhasajudas");
        },
        (error) => {
          setIsLoading(false);
          if (error.status === 401) {
            alert(
              "Sessão expirou! Efetue login novamente para concluir a operação"
            );
            dispatch(authActions.logout());
            localStorage.removeItem(gS.storage.token);
          } else {
            console.log(error);
            setDeleteError(true);
          }
        }
      );
    }
  };

  let isOwner = false;

  if (responseData.owner === loggedUsername) {
    isOwner = true;
  }

  //ir buscar id atraves do url -> fazer pedido ao servidor com esse id
  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.title}>
        <img src={typeHandler(responseData.type)} alt={responseData.type} />
        {responseData.title}
      </h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        <div className={classes.mapContent} id="MAPA_AQUI">
          MAPA_AQUI
        </div>
        <div className={classes.infoContent}>
          <div className={classes.helpTitle}>
            <HelpTitle
              title={responseData.title}
              helpType={responseData.type}
              creationDate={responseData.creationDate}
            />
          </div>
          <div className={classes.userDisplay}>
            <UserDisplay
              profileImg={
                responseData.anonymousOwner ? "" : responseData.profileImg
              }
              firstName={responseData.firstName}
              lastName={
                responseData.anonymousOwner ? "" : responseData.lastName
              }
              numHelps={responseData.numHelps}
              isAnonimous={responseData.anonymousOwner}
            />
          </div>
          <div className={classes.imageDisplay}>
            <ImageDisplay images={responseData.photoGalery} />
          </div>
          <div className={classes.description}>
            <h6 className={classes.subTitle}>Descrição</h6>
            <p>{responseData.description}</p>
          </div>
          <div className={classes.inputPass}>
            <InputPassword isOwner={isOwner} />
          </div>
          {!isOwner && (
            <div className={classes.buttonDisplay}>
              <Button text={props.buttonText} />
            </div>
          )}
          {isOwner && (
            <div className={classes.deleteRequest}>
              <span
                onClick={deleteRequestHandler}
                className={classes.deleteButton}
              >
                Apagar Pedido
              </span>
              {deleteError && (
                <p className={classes.deleteError}>
                  Erro inesperado, por favor tente novamente
                </p>
              )}
            </div>
          )}
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

/*          <ShareHelp />
 */
