import { useState } from "react";
import useInput from "../hooks/use-input";

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
    <form onSubmit={formSubmissionHandler}>
      <div>
        <h1>Contactos</h1>
        <div>
          <label htmlFor="name">Assunto</label>
          <select id="subject" value={subject} onChange={subjectHandler}>
            <option value="sugestions">Sugestões</option>
            <option value="partnership">Parcerias</option>
            <option value="problems">Problemas</option>
          </select>
        </div>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={enteredName}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
          />
          {nameHasError && <p>Por favor insira um nome.</p>}
        </div>
        <div>
          <label htmlFor="name">Email</label>
          <input
            type="text"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {emailHasError && <p>Por favor insira um e-mail.</p>}
        </div>
        <div>
          <label htmlFor="name">Como podemos ajudar?</label>
          <input
            type="text"
            id="help"
            value={enteredDescription}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          />
          {descriptionHasError && <p>Por favor insira uma descrição.</p>}
        </div>
        <button disabled={!formIsValid}>Enviar</button>
      </div>
    </form>
  );
};

export default Contacts;
//considerar fazer componente input para simplificar os componentes
//que tem as forms