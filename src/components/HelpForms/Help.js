import { Fragment, useState } from "react";
import useInput from "../hooks/use-input";
import ImageUpload from "../Registration/ImageUpload";
import Button from "../UI/Button";
import Icon from "../UI/Icon";
import IconButton from "../UI/IconButton";
import Anonimous from "./Anonimous";
import Volunteers from "./Volunteers";
import { Prompt } from "react-router-dom";

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
  const [fileUpload, setFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formConcluded, setFormConcluded] = useState(false);
  const [anonimousValue, setAnonimousValue] = useState(false);
  const [volunteersValue, setVolunteersValue] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const ajudarChangeHandler = () => {
    setSelected(AJUDAR);
  };

  const pedirAjudaChangeHandler = () => {
    setSelected(PEDIR);
  };

  const doarChangeHandler = () => {
    setSelected(DOAR);
  };

  const acoesChangeHandler = () => {
    setSelected(ACOES);
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

  const fileChangeHandler = (event) => {
    const files = event.target.files; //files array
    setFileUpload(true);
    setSelectedFile(files[0]);
  };

  const removeImageHandler = () => {
    setFileUpload(false);
    setSelectedFile(undefined);
  };

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

  const info = (
    <div>
      <div>
        <h1>{selected}</h1>
        <div>
          <label htmlFor="name">Título</label>
          <input
            type="text"
            id="title"
            value={enteredTitle}
            onChange={titleChangeHandler}
            onBlur={titleBlurHandler}
          />
          {titleHasError && <p>Por favor insira um título.</p>}
        </div>
        <div>
          <label htmlFor="name">Descrição</label>
          <input
            type="text"
            id="description"
            value={enteredDescription}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          />
          {descriptionHasError && <p>Por favor insira uma descrição.</p>}
        </div>
        <ImageUpload
          fileUpload={fileUpload}
          removeImageHandler={removeImageHandler}
          selectedFile={selectedFile}
          fileChangeHandler={fileChangeHandler}
        />
      </div>
    </div>
  );

  const selectHelp = (
    <div>
      <div>
        <Icon xmnls="" viewBox="" fill="" d="" />
        <h1>Escolhe Uma Categoria</h1>
      </div>
      <div>
        <IconButton
          xmnls=""
          viewBox=""
          fill=""
          d=""
          text={AJUDAR}
          onClick={ajudarChangeHandler}
        />
        <IconButton
          xmnls=""
          viewBox=""
          fill=""
          d=""
          text={PEDIR}
          onClick={pedirAjudaChangeHandler}
        />
        <IconButton
          xmnls=""
          viewBox=""
          fill=""
          d=""
          text={DOAR}
          onClick={doarChangeHandler}
        />
        <IconButton
          xmnls=""
          viewBox=""
          fill=""
          d=""
          text={ACOES}
          onClick={acoesChangeHandler}
        />
      </div>
    </div>
  );

  const renderButtons = (
    <div>
      <button onClick={backFormHandler}>
        <Icon />
      </button>
      <Button
        disabled={!formIsValid}
        onClick={formConcludedHandler}
        text="Próximo"
      />
    </div>
  );

  //TODO: #9 Adicionar Mapas: {formConcluded && mapa}

  return (
    <Fragment>
      <Prompt when={isFocused} message={(location) => ensureLeave} />
      <form onFocus={formFocusedHandler} onSubmit={formSubmissionHandler}>
        {selected === "" && !formConcluded && selectHelp}
        {selected !== "" && !formConcluded && info}
        {selected !== "" && selected !== ACOES && !formConcluded && (
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
        {selected !== "" && !formConcluded && renderButtons}
      </form>
    </Fragment>
  );
};

export default Help;
