import { useCallback, useEffect, useState } from "react";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import backIcon from "../../img/back.png";
import Anonimous from "./Anonimous";
import Volunteers from "./Volunteers";
import { Prompt, useHistory } from "react-router-dom";
import SelectHelp from "./SelectHelp";
import Info from "./Info";
import classes from "./Help.module.css";
import { createMarker } from "../../services/http";
import { useDispatch, useSelector } from "react-redux";
import Map from "../Map/Map";
import LoadingSpinner from "../UI/LoadingSpinner";
import MapDetails from "./MapDetails";
import { snackActions } from "../../store/snackBar/snack";

const AJUDAR = "Oferecer Ajuda";
const PEDIR = "Pedir Ajuda";
const DOAR = "Doar";
const ACOES = "Ações";

const isMarkerPassword = (value) =>
  value.trim().length >= 3 && value.trim().length <= 128;

const isTitle = (value) =>
  value.trim().length <= 30 && value.trim().length >= 3;

const isDescription = (value) =>
  value.trim().length >= 10 && value.trim().length <= 1000;

const isVolunteerNumber = (value) => {
  if (value > 0) {
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

const ensureLeave =
  "Tem a certeza que quer sair? Toda a informação inserida irá ser perdida.";

const Help = () => {
  const [selected, setSelected] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formConcluded, setFormConcluded] = useState(false);
  const [anonimousValue, setAnonimousValue] = useState(false);
  const [volunteersValue, setVolunteersValue] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [typeOfHelp, setTypeOfHelp] = useState("");
  const [location, setLocation] = useState("");

  const bounds = {
    latLower: 38.575291199755526,
    lngLower: -9.428419410934456,
    latTop: 38.83652687020928,
    lngTop: -8.84256058906556,
  };

  const [marker, setMarker] = useState("MARKER");
  const [move, setMove] = useState("WALKING");

  //AjudaMap state
  const [point, setPoint] = useState([]);
  const [dangerPoint, setDangerPoint] = useState([]);
  const [interestPoint, setInterestPoint] = useState([]);

  const [distance, setDistance] = useState(0);
  const [center, setCenter] = useState({
    lat: 38.7071,
    lng: -9.13549,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, []);

  const handleMarkerChange = (event) => {
    setMarker(event.target.value);
  };

  const handleMove = (event) => {
    setMove(event.target.value);
  };

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

  const distanceCallback = useCallback(
    (distance) => {
      setDistance(distance);
    },
    // eslint-disable-next-line
    [distance]
  );

  /************/
  const history = useHistory();

  const dispatch = useDispatch();

  const ownerEmail = useSelector((state) => state.auth.email);

  useEffect(() => {
    if (status) {
      setIsLoading(false);
      history.push("/juntos/minhasajudas");
    }
  }, [status]);

  const onSelectChangeHandler = (selectedAction) => {
    switch (selectedAction) {
      case AJUDAR:
        setSelected(AJUDAR);
        setTypeOfHelp("HELP_OFFER");
        break;
      case PEDIR:
        setSelected(PEDIR);
        setTypeOfHelp("HELP_REQUEST");
        break;
      case DOAR:
        setSelected(DOAR);
        setTypeOfHelp("DONATE");
        break;
      case ACOES:
        setSelected(ACOES);
        setTypeOfHelp("ACTION");
        break;
      default:
        setSelected("");
    }
  };

  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
  } = useInput(isTitle); //pass func to validate

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
  } = useInput(isDescription); //pass func to validate

  const {
    value: enteredNumberVolunteers,
    isValid: enteredNumberVolunteersIsValid,
    hasError: numberVolunteersHasError,
    valueChangeHandler: numberVolunteersChangeHandler,
    inputBlurHandler: numberVolunteersBlurHandler,
  } = useInput(isVolunteerNumber);

  const {
    value: enteredPass,
    isValid: enteredPassIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
  } = useInput(isMarkerPassword); //pass func to validate

  const {
    value: enteredDifficulty,
    isValid: enteredDifficultyIsValid,
    hasError: difficultyHasError,
    valueChangeHandler: difficultyChangeHandler,
    inputBlurHandler: difficultyBlurHandler,
  } = useInput(isDifficultyNumber);

  const formConcludedHandler = () => {
    setIsFocused(false);
    setFormConcluded(true);
  };

  const backFormConcludedHandler = () => {
    setIsFocused(false);
    setFormConcluded(false);
  };

  const backFormHandler = () => {
    setIsFocused(false); //decidir se vamos usar isto aqui tb
    setSelected("");
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
    selected !== ACOES &&
    enteredTitleIsValid &&
    enteredDescriptionIsValid &&
    enteredPassIsValid
  ) {
    formIsValid = true;
  } else if (
    selected === ACOES &&
    enteredTitleIsValid &&
    enteredDescriptionIsValid &&
    enteredPassIsValid
  ) {
    if (volunteersValue && enteredNumberVolunteersIsValid) {
      formIsValid = true;
    } else if (!volunteersValue) {
      formIsValid = true;
    }
  }

  let pointIsValid = false;

  if (point.length > 0 && point !== []) {
    if (selected === ACOES && point.length >= 2 && enteredDifficultyIsValid) {
      pointIsValid = true;
    } else if (selected !== ACOES) {
      pointIsValid = true;
    }
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

      if (selectedFiles.length > 0) {
        for (const image of selectedFiles) {
          formData.append("img", image);
        }
      }

      let generalType;

      if (typeOfHelp === "HELP_OFFER" || typeOfHelp === "DONATE") {
        generalType = "OFFER";
      } else {
        generalType = "REQUEST";
      }

      let difficulty = 1;
      let helpersCapactiy = 1;

      if (selected === ACOES) {
        difficulty = enteredDifficulty;
        helpersCapactiy = enteredNumberVolunteers;
      }

      if (helpersCapactiy < 1) {
        helpersCapactiy = 1;
      }

      const formInfo = {
        title: enteredTitle,
        description: enteredDescription,
        points: point,
        owner: ownerEmail,
        type: typeOfHelp,
        password: enteredPass,
        anonymousOwner: anonimousValue,
        generalType,
        difficulty: difficulty,
        helpersCapacity: helpersCapactiy,
        interests: interestPoint,
        dangers: dangerPoint,
        location: location,
      };

      if (selected !== ACOES) {
        formInfo.dangers = [];
        formInfo.interests = [];
      }

      formData.append(
        "marker",
        new Blob([JSON.stringify(formInfo)], { type: "application/json" })
      );

      createMarker(formData).then(
        (response) => {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "success",
              snackBarMessage: "Pedido criado com sucesso!",
            })
          );
          setStatus(true);
        },
        (error) => {
          setIsLoading(false);
          if (error && error.status === 403) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Descrição inválida.",
              })
            );
          } else if (error && error.status === 406) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Localização inválida.",
              })
            );
          } else if (error && error.status === 401) {
          } else if (error) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage:
                  "Algo inesperado aconteceu, por favor tenta novamente. Se o error persistir contacta-nos",
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
      <img
        src={backIcon}
        className={classes.back}
        onClick={backFormHandler}
        alt="página-anterior"
      />
      <div className={classes.nextButton}>
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
          disabled={!pointIsValid}
          onClick={formSubmissionHandler}
          text="Criar"
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
        <span className={classes.selectedTitle}>{selected}</span>
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
        <span className={classes.number}>3</span>
        <span className={classes.selectedTitle}>{selected}</span>
      </h1>
      <Map
        points={point}
        remove
        edit
        bounds={bounds}
        dangerPoints={dangerPoint}
        interestPoints={interestPoint}
        callback={pointsCallback}
        center={center}
        callbackC={callbackC}
        callbackD={distanceCallback}
        callbackDanger={dangerPointsCallback}
        callbackInterest={interestPointsCallback}
        markerTypeSelected={marker}
      />
      <div>
        <MapDetails
          markerType={marker}
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

  return (
    <div className={classes.mainContainer}>
      <Prompt when={isFocused} message={(location) => ensureLeave} />
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <form className={classes.formContainer}>
        {!selected && !formConcluded && (
          <SelectHelp onSelect={onSelectChangeHandler} />
        )}
        <div className={classes.subContainer}>
          {selected && !formConcluded && (
            <div className={classes.infoContainer}>
              <Info
                selected={selected}
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
                back={backFormHandler}
                images={selectedFiles}
                hasImage={selectedFiles.length <= 0 ? true : false}
              />
            </div>
          )}
          {selected && selected !== ACOES && !formConcluded && (
            <div className={classes.actionContainer}>
              <Anonimous
                yesAnonimous={yesAnonimousHandler}
                noAnonimous={noAnonimousHandler}
                anonimous={anonimousValue}
              />
            </div>
          )}
          {selected === ACOES && !formConcluded && (
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
          {selected && !formConcluded && renderButtons}
        </div>
      </form>
      <div className={classes.maps}>
        {selected !== ACOES && formConcluded && ajudaMap}
        {selected === ACOES && formConcluded && percursoMap}
        {formConcluded && renderCompleteButtons}
      </div>
    </div>
  );
};

export default Help;
