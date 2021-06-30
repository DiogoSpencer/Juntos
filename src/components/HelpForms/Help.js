import { Fragment, useState } from "react";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import backIcon from "../../img/back.png";
import Anonimous from "./Anonimous";
import Volunteers from "./Volunteers";
import { Prompt } from "react-router-dom";
import SelectHelp from "./SelectHelp";
import Info from "./Info";
import classes from "./Help.module.css";

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
  const [selectedFile, setSelectedFile] = useState([]);
  const [formConcluded, setFormConcluded] = useState(false);
  const [anonimousValue, setAnonimousValue] = useState(true);
  const [volunteersValue, setVolunteersValue] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

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
    reset: resetTitleInput,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredNumberVolunteers,
    isValid: enteredNumberVolunteersIsValid,
    hasError: numberVolunteersHasError,
    valueChangeHandler: numberVolunteersChangeHandler,
    inputBlurHandler: numberVolunteersBlurHandler,
    reset: resetNumberVolunteersInput,
  } = useInput(isVolunteerNumber);

  const formConcludedHandler = () => {
    setIsFocused(false);
    setFormConcluded(true);
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

  const formFocusedHandler = () => {
    setIsFocused(true);
  };

  let formIsValid = false;

  if (selected !== ACOES && enteredTitleIsValid && enteredDescriptionIsValid) {
    formIsValid = true;
  } else if (
    selected === ACOES &&
    enteredTitleIsValid &&
    enteredDescriptionIsValid
  ) {
    if (volunteersValue && enteredNumberVolunteersIsValid) {
      formIsValid = true;
    } else if (!volunteersValue) {
      formIsValid = true;
    }
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    const formData = new FormData();
    if (selectedFile !== null) {
      formData.append("profileImg", selectedFile);
    }

    const formInfo = {
      title: enteredTitle,
      description: enteredDescription,
    };

    formData.append(
      "info",
      new Blob([JSON.stringify(formInfo)], { type: "application/json" })
    );

    /*     registar(formData).then(
      (response) => {
        setSelectedFile(undefined);
      },
      (error) => {
        if (error.status === 400) {
          setInvalidInput(true);
        } else {
          setError(true);
        }
      }
    ) */
  };

  const renderButtons = (
    <div className={classes.buttonContainer}>
      <img src={backIcon} className={classes.back} onClick={backFormHandler} />
      <div className={classes.nextButton}>
        <Button
          disabled={!formIsValid}
          onClick={formConcludedHandler}
          text="Próximo"
        />
      </div>
    </div>
  );

  //TODO: #9 Adicionar Mapas: {formConcluded && mapa}

  return (
    <Fragment>
      <Prompt when={isFocused} message={(location) => ensureLeave} />
      <form onFocus={formFocusedHandler} onSubmit={formSubmissionHandler}>
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
            enteredDescription={enteredDescription}
            descriptionChangeHandler={descriptionChangeHandler}
            descriptionBlurHandler={descriptionBlurHandler}
            descriptionHasError={descriptionHasError}
            fileChangeHandler={setSelectedFile}
            back={backFormHandler}
            hasImage={selectedFile.length <= 0 ? true : false}
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
    </Fragment>
  );
};

export default Help;
