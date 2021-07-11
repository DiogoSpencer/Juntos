import { useCallback, useEffect, useState } from "react";
import CommentList from "./CommentList";
import HelpTitle from "./HelpTitle";
import ImageDisplay from "./ImageDisplay";
import UserDisplay from "./UserDisplay";
import { Route, Link, useRouteMatch, useHistory } from "react-router-dom";
import classes from "./HelpDetailsOwner.module.css";
import { markerDetails } from "../../services/http";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import gS from "../../services/generalServices.json";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/session/auth";
import { deleteMarker } from "../../services/http";
import Map from "../Map/Map";

const RESQUEST = "REQUEST";
const OFFER = "OFFER";

const HelpDetailsOwner = () => {
  const dispatch = useDispatch();

  let isOwner = false;
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [point, setPoint] = useState([]);
  const center =
    point.length > 0
      ? { lat: point[0].lat, lng: point[0].lon }
      : {
          lat: 38.7071,
          lng: -9.13549,
        };
  const zoom = 10;

  const pointsCallback = useCallback(
    (points) => {
      setPoint(points);
    },
    [point]
  );

  const history = useHistory();
  const match = useRouteMatch();
  const helpId = match.params.requestId;

  const loggedUsername = useSelector((state) => state.auth.username);

  useEffect(() => {
    if (!isOwner) {
      if (responseData && responseData.generalType === RESQUEST) {
        history.replace(`/ajudas/pedidos/${helpId}`);
      } else if (responseData && responseData.generalType === OFFER) {
        history.replace(`/ajudas/ofertas/${helpId}`);
      }
    }
  }, [isOwner, responseData]);

  useEffect(() => {
    setIsLoading(true);
    markerDetails(helpId).then(
      (response) => {
        setResponseData(response.data);
        let responsePoints = response.data.points;
        responsePoints.map((point) => {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        });
        setPoint(responsePoints);
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

  if (responseData && responseData.owner === loggedUsername) {
    isOwner = true;
  }

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
        <div className={classes.mapContent}>
          <Map
            noAdd
            noPlaces
            points={point}
            center={center}
            zoom={zoom}
            callback={pointsCallback}
          />
        </div>
        <div className={classes.infoContent}>
          <div className={classes.helpTitle}>
            <HelpTitle
              title={responseData.title}
              helpType={responseData.type}
              creationDate={responseData.creationDate}
              volunteers={responseData.helpersCapacity}
              difficulty={responseData.difficulty}
            />
          </div>
          <div className={classes.userDisplay}>
            <UserDisplay
              username={responseData.owner}
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
            <ImageDisplay images={responseData.photoGalery} owner={isOwner} />
          </div>
          <div className={classes.description}>
            <h6 className={classes.subTitle}>Descrição</h6>
            <p>{responseData.description}</p>
          </div>
          <Link to={`/editar/${helpId}`} className={classes.editRequest}>
            Editar Pedido
          </Link>
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
        </div>
        <div className={classes.commentContent}>
          <Route path={match.path} exact>
            <div>
              <Link to={`${match.url}/comentarios`}>Carregar Comentários</Link>
            </div>
          </Route>
          <Route path={`${match.path}/comentarios`}>
            <CommentList isOwner={isOwner}/>
          </Route>
        </div>
      </div>
    </div>
  );
};

export default HelpDetailsOwner;
//estamos a carregar comments dentro de uma route para nao termos que os ter la diretamente
//assim so carregamos se user quiser ver os comments, salva-nos um pedido ao server que ate
//podera ser enorme.
//ter link dentro de route faz com que o react router faça desaparecer o link

/*          <ShareHelp />
 */
