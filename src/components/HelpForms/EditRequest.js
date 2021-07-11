import { useCallback, useEffect, useState } from "react";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import backIcon from "../../img/back.png";
import Anonimous from "./Anonimous";
import Volunteers from "./Volunteers";
import { useHistory, useRouteMatch } from "react-router-dom";
import Info from "./Info";
import classes from "./EditRequest.module.css";
import { changeMarker } from "../../services/http";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";
import Map from "../Map/Map";
import LoadingSpinner from "../UI/LoadingSpinner";
import { markerDetails } from "../../services/http";
import MapDetails from "./MapDetails";

const ACTION = "ACTION";

let initialPoints = [];
const isNotEmpty = (value) => value.trim() !== "";
const isVolunteerNumber = (value) => {
  if (value > 0 && value <= 10) {
    return true;
  } else {
    return false;
  }
};
const isDifficultyNumber = (value) => {
  if (value > 0 && value <= 5) {
    return true;
  } else {
    return false;
  }
};

const EditRequest = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formConcluded, setFormConcluded] = useState(false);
  const [anonimousValue, setAnonimousValue] = useState(false);
  const [volunteersValue, setVolunteersValue] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [responseData, setResponseData] = useState([]);

  const history = useHistory();
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

  useEffect(() => {
    setIsLoading(true);
    markerDetails(helpId).then(
      (response) => {
        setResponseData(response.data);
        setTitleValueHandler(response.data.title);
        setDescriptionValueHandler(response.data.description);
        setSelectedFiles(response.data.photoGalery);
        setAnonimousValue(response.data.anonymousOwner);
        let responsePoints = response.data.points;
        responsePoints.map((point) => {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        });
        initialPoints = responsePoints;
        setPoint(responsePoints);
        setVolunteersValueHandler(response.data.helpersCapacity);
        setDifficultyValueHandler(response.data.difficulty);
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
    if (status) {
      history.replace(`/minhasajudas/criadas/${helpId}`);
    }
  }, [responseData, status]);

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
    value: enteredDifficulty,
    isValid: enteredDifficultyIsValid,
    hasError: difficultyHasError,
    valueChangeHandler: difficultyChangeHandler,
    inputBlurHandler: difficultyBlurHandler,
    setValueHandler: setDifficultyValueHandler,
  } = useInput(isDifficultyNumber);

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

  const yesVolunteersHandler = () => {
    setVolunteersValue(true);
  };

  const noVolunteersHandler = () => {
    setVolunteersValue(false);
  };

  let formIsValid = false;

  if (
    responseData.type !== ACTION &&
    enteredTitleIsValid &&
    enteredDescriptionIsValid
  ) {
    formIsValid = true;
  } else if (
    responseData.type === ACTION &&
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

  if (point.length > 0 && point !== []) {
    if (
      responseData.type === ACTION &&
      point.length >= 2 &&
      enteredDifficultyIsValid
    ) {
      pointIsValid = true;
    } else if (responseData.type !== ACTION) {
      pointIsValid = true;
    }
  }

  let changesMade = false;

  if (
    responseData.title !== enteredTitle ||
    responseData.description !== enteredDescription ||
    JSON.stringify(responseData.photoGalery) !==
      JSON.stringify(selectedFiles) ||
    responseData.anonymousOwner !== anonimousValue ||
    responseData.helpersCapacity !== enteredNumberVolunteers ||
    responseData.difficulty !== enteredDifficulty ||
    (point.length > 0 &&
      JSON.stringify(initialPoints) !== JSON.stringify(point))
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

    if (
      selectedFiles.length > 0 &&
      JSON.stringify(responseData.photoGalery) !== JSON.stringify(selectedFiles)
    ) {
      for (const image of selectedFiles) {
        if (image.type) {
          formData.append("Imgs", image);
        }
      }
    }

    let difficulty = 1;
    
    if (responseData.type === ACTION) {
      difficulty = enteredDifficulty;
    }

    let toRemove = responseData.photoGalery.filter(
      (photo) => !selectedFiles.includes(photo)
    );

    const formInfo = {
      title: enteredTitle,
      id: helpId,
      description: enteredDescription,
      points: point,
      difficulty: difficulty,
      imgsToDelete: toRemove,
      anonymousOwner: anonimousValue,
    };

    formData.append(
      "info",
      new Blob([JSON.stringify(formInfo)], { type: "application/json" })
    );

    changeMarker(formData).then(
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
      <div>
        <MapDetails
          difficultyChangeHandler={difficultyChangeHandler}
          enteredDifficulty={enteredDifficulty}
          difficultyBlurHandler={difficultyBlurHandler}
          difficultyHasError={difficultyHasError}
        />
      </div>
    </div>
  );

  //onFocus={formFocusedHandler}

  return (
    <div className={classes.mainContainer}>
      {isLoading && <div className={classes.spinner}>
        <LoadingSpinner/>
      </div>}
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
          {responseData.type !== ACTION && !formConcluded && (
            <div className={classes.actionContainer}>
              <Anonimous
                yesAnonimous={yesAnonimousHandler}
                noAnonimous={noAnonimousHandler}
                anonimous={anonimousValue}
              />
            </div>
          )}
          {responseData.type === ACTION && !formConcluded && (
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
        {responseData.type !== ACTION && formConcluded && ajudaMap}
        {responseData.type === ACTION && formConcluded && percursoMap}
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
