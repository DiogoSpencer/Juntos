import useInput from "../hooks/use-input";
import { useSelector } from "react-redux";
import classes from "./HeroiForm.module.css";
import { useState } from "react";
import Button from "../UI/Button";
import HeroiUpload from "./HeroiUpload";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useRouteMatch } from "react-router";

const isNotEmpty = (value) => value.trim() !== "";

const HeroiForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const firstName = useSelector((state) => state.auth.firstName);
  //const lastName = useSelector((state) => state.auth.lastName);
  const match = useRouteMatch();
  const urlCode = match.params.code;

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
  } = useInput(isNotEmpty);

  let formIsValid = false;

  if (enteredNameIsValid && enteredDescriptionIsValid && selectedFile) {
    formIsValid = true;
  }

  const heroiSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }
    setIsLoading(true);

    setIsLoading(false);
  };

  return (
    <form onSubmit={heroiSubmissionHandler} className={classes.heroiForm}>
      <h1 className={classes.heroiTitle}>Parabéns Herói {firstName}!</h1>
      <p className={classes.heroiInstructions}>
        Escolhe um dos teus pedidos favoritos de entre todos os que participaste
        e preenche este formulário com uma foto <br /> e uma pequena descrição a
        explicar porque este pedido foi tão especial para ti
      </p>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        <div className={classes.imageUploadDiv}>
          <HeroiUpload
            alt="upload-profile"
            selectedFile={selectedFile}
            fileChangeHandler={setSelectedFile}
          />
        </div>
        <div className={classes.actionTitle}>
          <label htmlFor="action">Nome da Ação</label>
          <input
            type="text"
            id="action"
            value={enteredName}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
          />
          {nameHasError && (
            <p className={classes.formError}>Por favor insira um nome.</p>
          )}
        </div>
        <div className={classes.help}>
          <label htmlFor="help">Fala-nos um pouco desta ação</label>
          <textarea
            id="help"
            rows="4"
            minLength="10"
            maxLength="5000"
            value={enteredDescription}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          >
            Fala um pouco desta ação...
          </textarea>
          {descriptionHasError && (
            <p className={classes.formError}>Por favor insira uma descrição.</p>
          )}
        </div>
        <div className={classes.buttonContainer}>
          <Button disabled={!formIsValid} text="Enviar" />
        </div>
      </div>
    </form>
  );
};

export default HeroiForm;
