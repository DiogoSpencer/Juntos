import { useState } from "react";
import useInput from "../hooks/use-input";
import classes from "./Contacts.module.css";
import Button from "../UI/Button";

const isNotEmpty = (value) => value.trim() !== "";

const Contacts = () => {
  const [subject, setSubject] = useState("sugestions");
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput(isNotEmpty);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(isNotEmpty);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
  } = useInput(isNotEmpty);

  const subjectHandler = (event) => {
    setSubject(event.value);
  };

  let formIsValid = false;

  if (enteredEmailIsValid && enteredNameIsValid && enteredDescriptionIsValid) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    //TODO: send to server

    resetNameInput();
    resetEmailInput();
    resetDescriptionInput();
    setSubject("sugestions");
  };

  return (
    <form onSubmit={formSubmissionHandler} className={classes.container}>
      <h1 className={classes.title}>Contactos</h1>
      <div className={classes.subContainer}>
        <div className={classes.subject}>
          <label htmlFor="subject">Assunto</label>
          <select
            id="subject"
            value={subject}
            onChange={subjectHandler}
            className={classes.selectSub}
          >
            <option value="sugestions">Sugestões</option>
            <option value="partnership">Parcerias</option>
            <option value="problems">Problemas</option>
          </select>
        </div>
        <div className={classes.name}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={enteredName}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
          />
          {nameHasError && <p className={classes.formError}>Por favor insira um nome.</p>}
        </div>
        <div className={classes.email}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {emailHasError && <p className={classes.formError}>Por favor insira um e-mail.</p>}
        </div>
        <div className={classes.help}>
          <label htmlFor="help">Como podemos ajudar?</label>
          <textarea
            id="help"
            rows="4"
            minLength="10"
            maxLength="5000"
            value={enteredDescription}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          >
            Descrição...
          </textarea>
          {descriptionHasError && <p className={classes.formError}>Por favor insira uma descrição.</p>}
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button disabled={!formIsValid} text="Enviar" />
      </div>
    </form>
  );
};

export default Contacts;
//considerar fazer componente input para simplificar os componentes
//que tem as forms
