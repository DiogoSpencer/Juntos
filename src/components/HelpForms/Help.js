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
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";
import Map from "../Map/Map";
import LoadingSpinner from "../UI/LoadingSpinner";

const AJUDAR = "Ajudar";
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

  //AjudaMap state
  const [point, setPoint] = useState([]);
  const pointsCallback = useCallback(
    (points) => {
      setPoint(points);
    },
    [point]
  );

  const history = useHistory();

  const dispatch = useDispatch();
  const ownerEmail = useSelector((state) => state.auth.email);

  useEffect(() => {
    if (status) {
      setIsLoading(false);
      history.go(0);
    }
  }, [status, history]);

  const onSelectChangeHandler = (selectedAction) => {
    switch (selectedAction) {
      case AJUDAR:
        setSelected(AJUDAR);
        break;
      case PEDIR:
        setSelected(PEDIR);
        break;
      case DOAR:
        setSelected(DOAR);
        break;
      case ACOES:
        setSelected(ACOES);
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
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
  } = useInput(isNotEmpty); //pass func to validate

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
  } = useInput(isNotEmpty); //pass func to validate

  const formConcludedHandler = () => {
    setIsFocused(false);
    setFormConcluded(true);
  };

  const backFormConcludedHandler = () => {
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

  if (point.length > 0) {
    pointIsValid = true;
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
    if (selectedFiles.length > 0) {
      for (const image of selectedFiles) {
        formData.append("img", image);
      }
    }

    const formInfo = {
      title: enteredTitle,
      description: enteredDescription,
      lat: point[0].latitude,
      lon: point[0].longitude,
      owner: ownerEmail,
      pathId: null,
      difficulty: "1",
    };

    formData.append(
      "marker",
      new Blob([JSON.stringify(formInfo)], { type: "application/json" })
    );

    createMarker(formData).then(
      (response) => {
        console.log(response);
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
    <div className={classes.buttonContainer}>
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
          onClick={backFormHandler}
        />
        <span className={classes.number}>3</span>
        <span className={classes.selectedTitle}>{selected}</span>
      </h1>
      <Map
        unique
        points={point.length <= 0 ? [] : [point[0]]}
        callback={pointsCallback}
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
          onClick={backFormHandler}
        />
        <span className={classes.number}>3</span>
        <span className={classes.selectedTitle}>{selected}</span>
      </h1>
      <Map points={point} callback={pointsCallback} />
    </div>
  );

  //onFocus={formFocusedHandler}

  return (
    <div className={classes.mainContainer}>
      <Prompt when={isFocused} message={(location) => ensureLeave} />
      <form className={classes.formContainer}>
        {!selected && !formConcluded && (
          <SelectHelp onSelect={onSelectChangeHandler} />
        )}
        {selected && !formConcluded && (
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
        )}
        {selected && selected !== ACOES && !formConcluded && (
          <Anonimous
            yesAnonimous={yesAnonimousHandler}
            noAnonimous={noAnonimousHandler}
            anonimous={anonimousValue}
          />
        )}
        {selected === ACOES && !formConcluded && (
          <Volunteers
            yesVolunteers={yesVolunteersHandler}
            noVolunteers={noVolunteersHandler}
            volunteersValue={volunteersValue}
            value={enteredNumberVolunteers}
            onChange={numberVolunteersChangeHandler}
            onBlur={numberVolunteersBlurHandler}
            error={numberVolunteersHasError}
          />
        )}
        {selected && !formConcluded && renderButtons}
      </form>
      <div className={classes.maps}>
        {selected !== ACOES && formConcluded && ajudaMap}
        {selected === ACOES && formConcluded && percursoMap}
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

export default Help;
