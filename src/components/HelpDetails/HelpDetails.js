import { useCallback, useEffect, useState } from "react";
import Button from "../UI/Button";
import CommentList from "./CommentList";
import HelpTitle from "./HelpTitle";
import ImageDisplay from "./ImageDisplay";
import UserDisplay from "./UserDisplay";
import { Route, Link, useRouteMatch, useHistory } from "react-router-dom";
import classes from "./HelpDetails.module.css";
import { joinMarker, leaveMarker, markerDetails } from "../../services/http";
import offerHelpIcon from "../../img/helpIcon.png";
import requestHelpIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import InputPassword from "./InputPassword";
import { useSelector } from "react-redux";
import Map from "../Map/Map";
import MapHelpDetails from "./MapHelpDetails";

let text = "";

const HelpDetails = () => {
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [point, setPoint] = useState([]);
  const [dangerPoint, setDangerPoint] = useState([]);
  const [interestPoint, setInterestPoint] = useState([]);
  const [isHelper, setIsHelper] = useState(false);
  const [hasChanges, setHasChanges] = useState(true);

  const [distance, setDistance] = useState(0);

  const [move, setMove] = useState("WALKING");
  const handleMove = (event) => {
    setMove(event.target.value);
  };

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
    // eslint-disable-next-line
    [point]
  );
  const distanceCallback = useCallback(
    (distance) => {
      setDistance(distance);
    },
    // eslint-disable-next-line
    [distance]
  );

  const match = useRouteMatch();
  const helpId = match.params.requestId;
  const history = useHistory();
  const loggedUsername = useSelector((state) => state.auth.username);

  useEffect(() => {
    if (hasChanges) {
      setIsLoading(true);
      markerDetails(helpId).then(
        (response) => {
          console.log(response.data);
          setIsLoading(false);
          setHasChanges(false);
          setResponseData(response.data);
          console.log(responseData);
          let responsePoints = response.data.points;
          for (const point of responsePoints) {
            point.lat = parseFloat(point.lat);
            point.lon = parseFloat(point.lon);
            point.type = response.data.type;
          }
          setPoint(responsePoints);

          let responseDanger = response.data.dangers;
          for (const point of responseDanger) {
            point.lat = parseFloat(point.lat);
            point.lon = parseFloat(point.lon);
          }
          setDangerPoint(responseDanger);

          let responseInterest = response.data.interests;
          for (const point of responseInterest) {
            point.lat = parseFloat(point.lat);
            point.lon = parseFloat(point.lon);
          }
          setInterestPoint(responseInterest);

          if (response.data.isAHelper) {
            setIsHelper(true);
          }
          typeHandler(response.data.type);
        },
        (error) => {
          setIsLoading(false);
          console.log(error);
        }
      );
    }
    // eslint-disable-next-line
  }, [helpId, hasChanges, loggedUsername]);

  useEffect(() => {
    if (responseData && responseData.length > 0) {
      if (
        match.path === "/minhasajudas/participacoes/:requestId" &&
        !isHelper
      ) {
        history.replace(
          `/ajudas/${
            responseData.generalType === "REQUEST" ? "pedidos" : "ofertas"
          }/${helpId}`
        );
      }
    }
    // eslint-disable-next-line
  }, [responseData]);

  const typeHandler = (type) => {
    switch (type) {
      case "HELP_OFFER":
        text = "Aceitar Ajuda";
        return offerHelpIcon;
      case "HELP_REQUEST":
        text = "Oferecer Ajuda";
        return requestHelpIcon;
      case "DONATE":
        text = "Aceitar Doação";
        return donateIcon;
      case "ACTION":
        text = "Participar";
        return actionIcon;
      default:
    }
  };

  let isOwner = false;

  if (responseData && responseData.owner === loggedUsername) {
    isOwner = true;
  }

  const joinHelpHandler = () => {
    setIsLoading(true);
    joinMarker(helpId).then(
      (response) => {
        setHasChanges(true);
        setIsLoading(false);
        setIsHelper(true);
        console.log(response);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
  };

  const onLeaveHandler = () => {
    setIsLoading(true);
    leaveMarker(helpId).then(
      (response) => {
        setHasChanges(true);
        setIsLoading(false);
        setIsHelper(false);
        console.log(response);
      },
      (error) => {
        setIsLoading(false);
      }
    );
  };

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.title}>
        <img
          src={typeHandler(responseData.type)}
          alt={responseData.type}
          className={classes.iconImg}
        />
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
            bounds={bounds}
            noPlaces
            points={point}
            dangerPoints={dangerPoint}
            interestPoints={interestPoint}
            callback={pointsCallback}
            center={center}
            moveTypeSelected={move}
            callbackD={distanceCallback}
          />
        </div>
        <div className={classes.infoContent}>
          <div className={classes.helpTitle}>
            <HelpTitle
              title={responseData.title}
              helpType={responseData.type}
              creationDate={responseData.creationDate}
              isActive={responseData.activeMarker}
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
              company={responseData.company}
            />
          </div>
          {responseData.type === "ACTION" && (
            <div className={classes.pathDetails}>
              <MapHelpDetails
                distance={distance}
                move={move}
                handleMove={handleMove}
                difficulty={responseData.difficulty}
                volunteers={responseData.helpersCapacity}
                currentHelpers={responseData.currentHelpers}
              />
            </div>
          )}
          <div className={classes.description}>
            <h6 className={classes.subTitle}>Descrição</h6>
            <p>{responseData.description}</p>
          </div>
          <div className={classes.imageDisplay}>
            <ImageDisplay images={responseData.photoGalery} />
          </div>

          {responseData && (responseData.wasAHelper || responseData.isAHelper) && (
            <div className={classes.inputPass}>
              {responseData.wasAHelper && (
                <p className={classes.passText}>
                  Ajuda concluída! Obrigado &#128512;
                </p>
              )}
              {responseData.isAHelper && (
                <InputPassword isOwner={isOwner} markerId={helpId} />
              )}
            </div>
          )}
          {!isOwner && responseData && !responseData.wasAHelper && (
            <div className={classes.buttonDisplay}>
              {!responseData.isAHelper ? (
                <Button
                  text={text}
                  onClick={joinHelpHandler}
                  disabled={!responseData.activeMarker}
                />
              ) : (
                <button
                  onClick={onLeaveHandler}
                  className={classes.giveUpButton}
                >
                  Desistir
                </button>
              )}
            </div>
          )}
        </div>
        <div className={classes.commentContent}>
          <Route path={match.path} exact>
            <div>
              <Link to={`${match.url}/comentarios`}>
                <Button text="Carregar Comentários" />
              </Link>
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

export default HelpDetails;
//estamos a carregar comments dentro de uma route para nao termos que os ter la diretamente
//assim so carregamos se user quiser ver os comments, salva-nos um pedido ao server que ate
//podera ser enorme.
//ter link dentro de route faz com que o react router faça desaparecer o link

/*          <ShareHelp />
 */
