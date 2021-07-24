import { useState } from "react";
import useInput from "../hooks/use-input";
import classes from "./Contacts.module.css";
import Button from "../UI/Button";
import { createTicket } from "../../services/http";

const PARTNERSHIP = "PARTNERSHIP";
const SUGGESTIONS = "SUGGESTIONS";
const PROBLEMS = "PROBLEMS";

const isName = (value) => value.trim().length >= 2 && value.trim().length <= 13;
const isEmail = (value) => value.trim().match("^(.+)@(.+)$");
const isDescription = (value) =>
  value.trim().length >= 10 && value.trim().length <= 1000;

const Contacts = () => {
  const [subject, setSubject] = useState(SUGGESTIONS);

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput(isName);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(isEmail);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
  } = useInput(isDescription);

  const subjectHandler = (event) => {
    setSubject(event.target.value);
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

    const ticketBody = {
      email: enteredEmail,
      text: enteredDescription,
      title: enteredName,
      type: subject,
    };

    createTicket(ticketBody).then(
      (response) => {
        resetNameInput();
        resetEmailInput();
        resetDescriptionInput();
        setSubject(SUGGESTIONS);
      },
      (error) => {
        console.log(error);
      }
    );
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
            <option value={SUGGESTIONS}>Sugestões</option>
            <option value={PARTNERSHIP}>Parcerias</option>
            <option value={PROBLEMS}>Problemas</option>
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
            maxLength={50}
          />
          {nameHasError && (
            <p className={classes.formError}>Por favor insira um nome.</p>
          )}
        </div>
        <div className={classes.email}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            maxLength={254}
          />
          {emailHasError && (
            <p className={classes.formError}>Por favor insira um e-mail.</p>
          )}
        </div>
        <div className={classes.help}>
          <label htmlFor="help">Como podemos ajudar?</label>
          <textarea
            id="help"
            rows={4}
            minLength={10}
            maxLength={1000}
            value={enteredDescription}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          >
            Descrição...
          </textarea>
          {descriptionHasError && (
            <p className={classes.formError}>
              Por favor insira uma descrição (entre 10 e 2000 caracteres).
            </p>
          )}
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
