import { useCallback, useEffect, useState } from "react";
import CommentList from "./CommentList";
import HelpTitle from "./HelpTitle";
import ImageDisplay from "./ImageDisplay";
import UserDisplay from "./UserDisplay";
import { Route, Link, useRouteMatch, useHistory } from "react-router-dom";
import classes from "./HelpDetailsOwner.module.css";
import { markerDetails, restartMarker, startMarker } from "../../services/http";
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
import juntosIcon from "../../img/logo.png";
import useInput from "../hooks/use-input";

const isNotEmpty = (value) => value.trim() !== "";

const RESQUEST = "REQUEST";
const OFFER = "OFFER";

const HelpDetailsOwner = () => {
  const dispatch = useDispatch();

  let isOwner = false;
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dangerPoint, setDangerPoint] = useState([]);
  const [interestPoint, setInterestPoint] = useState([]);
  const [deleteError, setDeleteError] = useState(false);
  const [point, setPoint] = useState([]);
  const [beginAction, setBeginAction] = useState(false);

  const center =
    point.length > 0
      ? { lat: point[0].lat, lng: point[0].lon }
      : {
          lat: 38.7071,
          lng: -9.13549,
        };
  const bounds = {
    latLower: 38.575291199755526,
    lngLower: -9.428419410934456,
    latTop: 38.83652687020928,
    lngTop: -8.84256058906556,
  };
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

  const {
    value: enteredPass,
    isValid: enteredPassIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
  } = useInput(isNotEmpty); //pass func to validate

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
        console.log(response.data);
        setResponseData(response.data);
        let responsePoints = response.data.points;
        responsePoints.map((point) => {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        });
        setPoint(responsePoints);

        let responseDanger = response.data.dangers;
        responseDanger.map((point) => {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        });
        setDangerPoint(responseDanger);

        let responseInterest = response.data.interests;
        responseInterest.map((point) => {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        });
        setInterestPoint(responseInterest);
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

  const beginActionHandler = () => {
    setIsLoading(true);
    startMarker(helpId).then(
      (response) => {
        setBeginAction(true);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        if (error.status === 401) {
          alert(
            "Sessão expirou! Efetue login novamente para concluir a operação"
          );
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
        }
        console.log(error);
      }
    );
  };

  const reActivateRequest = () => {
    setIsLoading(true);
    restartMarker(helpId, enteredPass).then(
      (response) => {
        setIsLoading(false);
        history.go(0);
      },
      (error) => {
        setIsLoading(false);
        if (error.status === 401) {
          alert(
            "Sessão expirou! Efetue login novamente para concluir a operação"
          );
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
        }
        console.log(error);
      }
    );
  };

  const showBeginAction = (
    <div className={classes.completeDiv}>
      <h1 className={classes.completeTitle}>Ação Iniciada!</h1>
      <img src={juntosIcon} alt="juntos-icon" className={classes.completeImg} />
    </div>
  );

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
      {!isLoading && beginAction && showBeginAction}
      <div className={classes.subContainer}>
        <div className={classes.mapContent}>
          <Map
            noAdd
            bounds={bounds}
            noPlaces
            points={point}
            dangerPoints={dangerPoint}
            interestPoints={interestPoint}
            callback={pointsCallback}
            center={center}
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
              currentHelpers={responseData.currentHelpers}
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
          {responseData.activeMarker &&
            responseData.currentHelpers > 0 &&
            responseData.type === "ACTION" && (
              <button
                type="button"
                onClick={beginActionHandler}
                className={classes.startAction}
              >
                Iniciar Ação
              </button>
            )}
          {!responseData.activeMarker && (
            <form onSubmit={reActivateRequest} className={classes.passForm}>
              <label htmlFor="pass" className={classes.labelPass}>
                Insira uma nova password para re-activar:
              </label>
              <input
                type="text"
                id="pass"
                value={enteredPass}
                onChange={passChangeHandler}
                onBlur={passBlurHandler}
                className={classes.inputPass}
              />
              {passHasError && (
                <p className={classes.errorPass}>
                  Por favor insere uma password válida
                </p>
              )}
              <button
                type="button"
                onClick={reActivateRequest}
                className={classes.reactivate}
                disabled={!enteredPassIsValid}
              >
                Re-Activar
              </button>
            </form>
          )}
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
            <CommentList isOwner={isOwner} />
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
