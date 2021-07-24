import useInput from "../hooks/use-input";
import { useSelector } from "react-redux";
import classes from "./HeroiForm.module.css";
import { useState } from "react";
import Button from "../UI/Button";
import HeroiUpload from "./HeroiUpload";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useHistory, useRouteMatch } from "react-router";
import { createHero } from "../../services/http";

const isName = (value) => value.trim().length >= 2 && value.trim().length <= 60;
const isDescription = (value) => value.trim().length >= 10;

const HeroiForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const firstName = useSelector((state) => state.auth.firstName);
  //const lastName = useSelector((state) => state.auth.lastName);
  const match = useRouteMatch();
  const urlCode = match.params.code;
  const history = useHistory();

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput(isName);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
  } = useInput(isDescription);

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

    const formData = new FormData();
    if (selectedFile !== null) {
      formData.append("img", selectedFile);
    }

    const heroForm = {
      description: enteredDescription,
      title: enteredName,
      code: urlCode,
    };

    formData.append(
      "form",
      new Blob([JSON.stringify(heroForm)], { type: "application/json" })
    );

    createHero(formData).then(
      (response) => {
        console.log(response);
        history.replace("/home")
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );

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
            minLength={2}
            maxLength={60}
          />
          {nameHasError && (
            <p className={classes.formError}>
              Por favor insira um nome, 2 a 60 caracteres.
            </p>
          )}
        </div>
        <div className={classes.help}>
          <label htmlFor="help">Fala-nos um pouco desta ação</label>
          <textarea
            id="help"
            rows={4}
            minLength={10}
            value={enteredDescription}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          >
            Fala um pouco desta ação...
          </textarea>
          {descriptionHasError && (
            <p className={classes.formError}>
              Por favor insira uma descrição, mais que 10 caracteres.
            </p>
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
