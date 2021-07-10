import { useCallback, useEffect, useState } from "react";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import backIcon from "../../img/back.png";
import Anonimous from "./Anonimous";
import Volunteers from "./Volunteers";
import { useRouteMatch } from "react-router-dom";
import Info from "./Info";
import classes from "./EditRequest.module.css";
import { changeMarker, createPath } from "../../services/http";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";
import Map from "../Map/Map";
import LoadingSpinner from "../UI/LoadingSpinner";
import { markerDetails } from "../../services/http";

const AJUDAR = "Oferecer Ajuda";
const PEDIR = "Pedir Ajuda";
const DOAR = "Doar";
const ACOES = "Ações";

const isNotEmpty = (value) => value.trim() !== "";
const isVolunteerNumber = (value) => {
  if (value > 0 && value <= 10) {
    return true;
  } else {
    return false;
  }
};

let typeOfHelp;

const ensureLeave =
  "Tem a certeza que quer sair? Toda a informação inserida irá ser perdida.";

const EditRequest = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formConcluded, setFormConcluded] = useState(false);
  const [anonimousValue, setAnonimousValue] = useState(false);
  const [volunteersValue, setVolunteersValue] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [responseData, setResponseData] = useState([]);

  const match = useRouteMatch();
  const helpId = match.params.requestId;
  const editing = match.path === "/editar/:requestId";

  //AjudaMap state
  const [point, setPoint] = useState([]);

  const [center, setCenter] = useState({
    lat: 38.7071,
    lng: -9.13549,
  });

  const [zoom, setZoom] = useState(10);

  const callbackC = useCallback(
    (center) => {
      setCenter(center);
    },
    [center]
  );

  const callbackZ = useCallback(
    (zoom) => {
      setZoom(zoom);
    },
    [zoom]
  );

  const pointsCallback = useCallback(
    (points) => {
      setPoint(points);
    },
    [point]
  );

  /************/
  const dispatch = useDispatch();

  const ownerEmail = useSelector((state) => state.auth.email);

  useEffect(() => {
    setIsLoading(true);
    markerDetails(helpId).then(
      (response) => {
        console.log(response.data);
        setResponseData(response.data);
        setTitleValueHandler(response.data.title);
        setDescriptionValueHandler(response.data.description);
        setSelectedFiles(response.data.photoGalery);
        setAnonimousValue(response.data.anonymousOwner);
        let newVec = {
          lat: parseFloat(response.data.lat),
          lon: parseFloat(response.data.lon),
        };
        setPoint([newVec]);
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

  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    setValueHandler: setTitleValueHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    setValueHandler: setDescriptionValueHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredNumberVolunteers,
    isValid: enteredNumberVolunteersIsValid,
    hasError: numberVolunteersHasError,
    valueChangeHandler: numberVolunteersChangeHandler,
    inputBlurHandler: numberVolunteersBlurHandler,
    setValueHandler: setVolunteersValueHandler,
  } = useInput(isVolunteerNumber);

  const {
    value: enteredPass,
    isValid: enteredPassIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
    setValueHandler: setPassValueHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const formConcludedHandler = () => {
    setFormConcluded(true);
  };

  const backFormConcludedHandler = () => {
    setFormConcluded(false);
  };

  const yesAnonimousHandler = () => {
    setAnonimousValue(true);
  };

  const noAnonimousHandler = () => {
    setAnonimousValue(false);
  };

  const yesVolunteersHandler = (event) => {
    event.preventDefault();
    setVolunteersValue(true);
  };

  const noVolunteersHandler = (event) => {
    event.preventDefault();
    setVolunteersValue(false);
  };

  let formIsValid = false;

  if (
    responseData.type !== ACOES &&
    enteredTitleIsValid &&
    enteredDescriptionIsValid
  ) {
    formIsValid = true;
  } else if (
    responseData.type === ACOES &&
    enteredTitleIsValid &&
    enteredDescriptionIsValid
  ) {
    if (volunteersValue && enteredNumberVolunteersIsValid) {
      formIsValid = true;
    } else if (!volunteersValue) {
      formIsValid = true;
    }
  }

  let pointIsValid = false;

  if (point.length > 0) {
    pointIsValid = true;
  }

  let changesMade = false;

  if (
    responseData.title !== enteredTitle ||
    responseData.description !== enteredDescription ||
    JSON.stringify(responseData.photoGalery) !==
      JSON.stringify(selectedFiles) ||
    responseData.anonymousOwner !== anonimousValue ||
    (point.length > 0 &&
      (parseFloat(responseData.lat) !== point[0].lat ||
        parseFloat(responseData.lon) !== point[0].lon))
  ) {
    changesMade = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    if (!pointIsValid) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
/*
    if (selectedFiles.length > 0) {
      for (const image of selectedFiles) {
        formData.append("img", image);
      }
    }
*/

    const formInfo = {
      title: enteredTitle,
      description: enteredDescription,
      lat: point[0].lat,
      lon: point[0].lon,
      difficulty: "1",
      //anonymousOwner: anonimousValue,
      id: helpId,
    };

    const formAcaoInfo = {
      title: enteredTitle,
      id: helpId,
      description: enteredDescription,
      points: point,
      owner: ownerEmail,
      difficulty: "1",
      type: typeOfHelp,
      password: enteredPass,
      anonymousOwner: anonimousValue,
    };

    if (responseData.type !== ACOES) {
      formData.append(
        "info",
        new Blob([JSON.stringify(formInfo)], { type: "application/json" })
      );
    } else if (responseData.type === ACOES) {
      formData.append(
        "path",
        new Blob([JSON.stringify(formAcaoInfo)], { type: "application/json" })
      );
    }

    if (responseData.type !== ACOES) {
      changeMarker(formData).then(
        (response) => {
          setStatus(true);
          console.log(response);
        },
        (error) => {
          if (error.status === 401) {
            alert("Sessão expirou");
            dispatch(authActions.logout());
            localStorage.removeItem(gS.storage.token);
          }
          console.log(error);
          setIsLoading(false);
        }
      );
    } else if (responseData.type === ACOES) {
      createPath(formData).then(
        (response) => {
          setStatus(true);
        },
        (error) => {
          if (error.status === 401) {
            alert("Sessão expirou");
            dispatch(authActions.logout());
            localStorage.removeItem(gS.storage.token);
          }
          console.log(error);
          setIsLoading(false);
        }
      );
    }
  };

  //formConcludedHandler
  const renderButtons = (
    <div className={`${classes.buttonContainer} ${classes.formButtons}`}>
      <div className={classes.firstNext}>
        <Button
          type="button"
          disabled={!formIsValid}
          onClick={formConcludedHandler}
          text="Próximo"
        />
      </div>
    </div>
  );

  const renderCompleteButtons = (
    <div className={`${classes.buttonContainer} ${classes.completeButtons}`}>
      <img
        src={backIcon}
        className={classes.back}
        onClick={backFormConcludedHandler}
        alt="página-anterior"
      />
      <div className={classes.nextButton}>
        <Button
          disabled={!pointIsValid || !changesMade}
          onClick={formSubmissionHandler}
          text="Alterar"
        />
      </div>
    </div>
  );

  const ajudaMap = (
    <div className={classes.map}>
      <h1 className={classes.title}>
        <img
          src={backIcon}
          alt="página-anterior"
          className={classes.back}
          onClick={backFormConcludedHandler}
        />
        <span className={classes.number}>3</span>
        <span className={classes.selectedTitle}>{enteredTitle}</span>
      </h1>
      <Map
        unique
        zoom={zoom}
        center={center}
        points={point.length <= 0 ? [] : [point[0]]}
        callback={pointsCallback}
        callbackC={callbackC}
        callbackZ={callbackZ}
      />
    </div>
  );

  const percursoMap = (
    <div className={classes.map}>
      <h1 className={classes.title}>
        <img
          src={backIcon}
          alt="página-anterior"
          className={classes.back}
          onClick={backFormConcludedHandler}
        />
        <span className={classes.number}>3</span>
        <span className={classes.selectedTitle}>{enteredTitle}</span>
      </h1>
      <Map
        points={point}
        callback={pointsCallback}
        zoom={zoom}
        center={center}
        callbackC={callbackC}
        callbackZ={callbackZ}
      />
    </div>
  );

  //onFocus={formFocusedHandler}

  return (
    <div className={classes.mainContainer}>
      <form className={classes.formContainer}>
        <div className={classes.subContainer}>
          {!formConcluded && (
            <div className={classes.infoContainer}>
              <Info
                selected={enteredTitle}
                enteredTitle={enteredTitle}
                titleChangeHandler={titleChangeHandler}
                titleBlurHandler={titleBlurHandler}
                titleHasError={titleHasError}
                enteredPass={enteredPass}
                passChangeHandler={passChangeHandler}
                passBlurHandler={passBlurHandler}
                passHasError={passHasError}
                enteredDescription={enteredDescription}
                descriptionChangeHandler={descriptionChangeHandler}
                descriptionBlurHandler={descriptionBlurHandler}
                descriptionHasError={descriptionHasError}
                fileChangeHandler={setSelectedFiles}
                images={selectedFiles}
                hasImage={selectedFiles.length <= 0 ? true : false}
                editing={editing}
              />
            </div>
          )}
          {responseData.type !== ACOES && !formConcluded && (
            <div className={classes.actionContainer}>
              <Anonimous
                yesAnonimous={yesAnonimousHandler}
                noAnonimous={noAnonimousHandler}
                anonimous={anonimousValue}
              />
            </div>
          )}
          {responseData.type === ACOES && !formConcluded && (
            <div className={classes.actionContainer}>
              <Volunteers
                yesVolunteers={yesVolunteersHandler}
                noVolunteers={noVolunteersHandler}
                volunteersValue={volunteersValue}
                value={enteredNumberVolunteers}
                onChange={numberVolunteersChangeHandler}
                onBlur={numberVolunteersBlurHandler}
                error={numberVolunteersHasError}
              />
            </div>
          )}
          {!formConcluded && renderButtons}
        </div>
      </form>
      <div className={classes.maps}>
        {responseData.type !== ACOES && formConcluded && ajudaMap}
        {responseData.type === ACOES && formConcluded && percursoMap}
        {formConcluded && renderCompleteButtons}
      </div>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default EditRequest;