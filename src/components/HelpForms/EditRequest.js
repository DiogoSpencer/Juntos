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
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "../../store/snackBar/snack";
import Map from "../Map/Map";
import LoadingSpinner from "../UI/LoadingSpinner";
import { markerDetails } from "../../services/http";
import MapDetails from "./MapDetails";

const ACTION = "ACTION";

let initialPoints = [];
let initialDangers = [];
let initialInterests = [];

const isDescription = (value) =>
  value.trim().length >= 10 && value.trim().length <= 1000;

const isTitle = (value) =>
  value.trim().length <= 30 && value.trim().length >= 3;

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
  const authUsername = useSelector((state) => state.auth.username);
  const authRole = useSelector((state) => state.auth.role);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formConcluded, setFormConcluded] = useState(false);
  const [anonimousValue, setAnonimousValue] = useState(false);
  const [volunteersValue, setVolunteersValue] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [passwordValue, setPasswordValue] = useState("");
  const [type, setType] = useState("");

  const history = useHistory();
  const match = useRouteMatch();
  const helpId = match.params.requestId;
  const editing = match.path === "/juntos/editar/:requestId";

  const [markerType, setMarker] = useState("MARKER");
  const [move, setMove] = useState("WALKING");
  const [moveChange, setMoveChange] = useState(false);

  //AjudaMap state
  const [point, setPoint] = useState([]);
  const [dangerPoint, setDangerPoint] = useState([]);
  const [interestPoint, setInterestPoint] = useState([]);
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState(0);

  const [center, setCenter] = useState({
    lat: 38.7071,
    lng: -9.13549,
  });

  const bounds = {
    latLower: 38.575291199755526,
    lngLower: -9.428419410934456,
    latTop: 38.83652687020928,
    lngTop: -8.84256058906556,
  };

  const handleMarkerChange = (event) => {
    setMarker(event.target.value);
  };
  const handleMove = (event) => {
    setMove(event.target.value);
    setMoveChange(true);
  };

  const distanceCallback = useCallback(
    (distance) => {
      setDistance(distance);
    },
    // eslint-disable-next-line
    [distance]
  );

  const callbackC = useCallback(
    (center) => {
      setCenter(center);
    },
    // eslint-disable-next-line
    [center]
  );

  const pointsCallback = useCallback(
    (points) => {
      setPoint(points);
    },
    // eslint-disable-next-line
    [point]
  );

  const dangerPointsCallback = useCallback(
    (points) => {
      setDangerPoint(points);
    },
    // eslint-disable-next-line
    [dangerPoint]
  );
  const interestPointsCallback = useCallback(
    (points) => {
      setInterestPoint(points);
    },
    // eslint-disable-next-line
    [interestPoint]
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
        setPasswordValue(response.data.password);
        setType(response.data.type);
        let responsePoints = response.data.points;
        for (const point of responsePoints) {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        }

        initialPoints = responsePoints;
        setPoint(responsePoints);
        setCenter({ lat: responsePoints[0].lat, lng: responsePoints[0].lon });
        let responseDanger = response.data.dangers;
        for (const point of responseDanger) {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        }

        setDangerPoint(responseDanger);
        initialDangers = responseDanger;

        let responseInterest = response.data.interests;
        for (const point of responseInterest) {
          point.lat = parseFloat(point.lat);
          point.lon = parseFloat(point.lon);
        }

        setInterestPoint(responseInterest);
        initialInterests = responseInterest;
        setVolunteersValueHandler(response.data.helpersCapacity);
        setDifficultyValueHandler(response.data.difficulty);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        if (error && error.status !== 401) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage:
                "Algo inesperado aconteceu, tenta novamente e se persistir contacta-nos",
            })
          );
        }
      }
    );
    // eslint-disable-next-line
  }, [helpId, dispatch]);

  useEffect(() => {
    if (authUsername !== responseData.owner) {
      if (authRole === "USER" || authRole === "PARTNER") {
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "info",
            snackBarMessage: "Só podes editar os teus próprios pedidos",
          })
        );
        history.goBack();
      }
    }
    // eslint-disable-next-line
  }, [responseData, authRole, authUsername]);

  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    setValueHandler: setTitleValueHandler,
  } = useInput(isTitle); //pass func to validate

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    setValueHandler: setDescriptionValueHandler,
  } = useInput(isDescription); //pass func to validate

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
    responseData &&
    (responseData.title !== enteredTitle ||
      moveChange ||
      responseData.description !== enteredDescription ||
      JSON.stringify(responseData.photoGalery) !==
        JSON.stringify(selectedFiles) ||
      responseData.anonymousOwner !== anonimousValue ||
      responseData.helpersCapacity !== enteredNumberVolunteers ||
      responseData.difficulty !== enteredDifficulty ||
      (point.length > 0 &&
        JSON.stringify(initialPoints) !== JSON.stringify(point)) ||
      (dangerPoint.length >= 0 &&
        JSON.stringify(initialDangers) !== JSON.stringify(dangerPoint)) ||
      (interestPoint.length >= 0 &&
        JSON.stringify(initialInterests) !== JSON.stringify(interestPoint)))
  ) {
    changesMade = true;
  }

  useEffect(() => {
    if (location !== "") {
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
        JSON.stringify(responseData.photoGalery) !==
          JSON.stringify(selectedFiles)
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

      let toRemove = [];

      if (
        responseData.photoGalery &&
        responseData.photoGalery.length > 0 &&
        selectedFiles &&
        selectedFiles.length > 0
      ) {
        toRemove = responseData.photoGalery.filter(
          (photo) => !selectedFiles.includes(photo)
        );
      } else if (
        responseData.photoGalery &&
        responseData.photoGalery.length > 0 &&
        (!selectedFiles || (selectedFiles && selectedFiles.length === 0))
      ) {
        console.log("here");
        toRemove = responseData.photoGalery;
      }

      let numberVolunteers = enteredNumberVolunteers;

      if (numberVolunteers < 1) {
        numberVolunteers = 1;
      }

      const formInfo = {
        type: type,
        title: enteredTitle,
        id: helpId,
        description: enteredDescription,
        points: point,
        difficulty: difficulty,
        imgsToDelete: toRemove,
        anonymousOwner: anonimousValue,
        helpersCapacity: numberVolunteers,
        location: location,
      };

      if (responseData.type === ACTION) {
        formInfo.dangers = dangerPoint;
        formInfo.interests = interestPoint;
      }

      formData.append(
        "info",
        new Blob([JSON.stringify(formInfo)], { type: "application/json" })
      );

      changeMarker(formData).then(
        (response) => {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "success",
              snackBarMessage: "Edição completa com sucesso!",
            })
          );
          history.replace(`/juntos/minhasajudas/criadas/${helpId}`);
        },
        (error) => {
          setIsLoading(false);
          if (error && error.status === 400) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Só podes editar pedidos da tua própria conta",
              })
            );
          } else if (error && error.status === 401) {
          } else if (error && error.status === 404) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage:
                  "O pedido que estás a tentar editar não existe",
              })
            );
          } else {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage:
                  "Algo inesperado aconteceu, tenta novamente se persistir contacta-nos",
              })
            );
          }
        }
      );
    }
  }, [location]);

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    if (!pointIsValid) {
      return;
    }

    if (!changesMade) {
      return;
    }

    setIsLoading(true);

    const geocoder = new window.google.maps.Geocoder();

    if (point.length > 0) {
      let locationPo = new window.google.maps.LatLng(
        point[0].lat,
        point[0].lon
      );
      let admin = "administrative_area_level_1";
      geocoder
        .geocode({ location: locationPo, componentRestrictions: {} }, null)
        .then(
          (response) => {
            let res = response.results.filter((res) => {
              return res.types.includes(admin);
            });
            if (res.length > 0) {
              setLocation(res[0].address_components[0].long_name);
            } else setLocation("");
          },
          (error) => {
            setLocation("");
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
        <span className={classes.number}>2</span>
        <span className={classes.selectedTitle}>{enteredTitle}</span>
      </h1>
      <Map
        unique
        center={center}
        bounds={bounds}
        points={point.length <= 0 ? [] : [point[0]]}
        dangerPoints={[]}
        interestPoints={[]}
        callback={pointsCallback}
        callbackC={callbackC}
        markerTypeSelected={"MARKER"}
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
        <span className={classes.number}>2</span>
        <span className={classes.selectedTitle}>{enteredTitle}</span>
      </h1>
      <Map
        points={point}
        remove
        edit
        editRe
        bounds={bounds}
        showDelete
        dangerPoints={dangerPoint}
        interestPoints={interestPoint}
        callback={pointsCallback}
        center={center}
        callbackC={callbackC}
        callbackD={distanceCallback}
        callbackDanger={dangerPointsCallback}
        callbackInterest={interestPointsCallback}
        markerTypeSelected={markerType}
      />
      <div>
        <MapDetails
          markerType={markerType}
          handleMarkerChange={handleMarkerChange}
          difficultyChangeHandler={difficultyChangeHandler}
          enteredDifficulty={enteredDifficulty}
          difficultyBlurHandler={difficultyBlurHandler}
          difficultyHasError={difficultyHasError}
          distance={distance}
          interests={interestPoint}
          interestsHandler={setInterestPoint}
          dangers={dangerPoint}
          dangersHandler={setDangerPoint}
        />
      </div>
    </div>
  );

  //onFocus={formFocusedHandler}

  return (
    <div className={classes.mainContainer}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
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
                enteredPass={passwordValue}
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
