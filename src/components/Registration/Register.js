import { Fragment, useState } from "react";
import { useHistory } from "react-router";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import ImageUpload from "./ImageUpload";
import { register as registar } from "../../services/http";
import { useSelector } from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Register.module.css";
import juntosIcon from "../../img/logo.png";

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const isProfile = false
const isNotEmpty = (value) => value.trim() !== "";
//TODO: #2 fazer os REGEX de verificacao
//TODO: #3 Verify if image is one of these types
//TODO: #4 Restrict image size

const Register = (props) => {
  const history = useHistory();
  const isLogged = useSelector((state) => state.auth.isLogged);

  //TODO: #2 Fazer useReducer para isto tudo..
  const [invalidInput, setInvalidInput] = useState(false);
  const [emailHasAccount, setEmailHasAccount] = useState(false);
  const [error, setError] = useState(false);
  const [privacy, setPrivacy] = useState(PUBLIC);
  const [concluded, setConcluded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredConfirmation,
    isValid: enteredConfirmationIsValid,
    hasError: confirmationHasError,
    valueChangeHandler: confirmationChangeHandler,
    inputBlurHandler: confirmationBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
  } = useInput(isNotEmpty);

  const privacyChangeHandler = () => {
    if (privacy === PUBLIC) {
      setPrivacy(PRIVATE);
    } else {
      setPrivacy(PUBLIC);
    }
  };

  //redirect home if logged - logged users cant register
  const redirectHandler = () => {
    history.replace("/home");
  };

  let formIsValid = false;

  let passConfirmed = false;

  if (!enteredPassword.localeCompare(enteredConfirmation)) {
    passConfirmed = true;
  }

  if (
    enteredEmailIsValid &&
    enteredPasswordIsValid &&
    enteredUsernameIsValid &&
    enteredConfirmationIsValid &&
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    passConfirmed
  ) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    props.setIsLoading(true);

    const formData = new FormData();
    if (selectedFile !== null) {
      formData.append("profileImg", selectedFile);
    }

    const userInfo = {
      email: enteredEmail,
      password: enteredPassword,
      confirmation: enteredConfirmation,
      username: enteredUsername,
      firstName: enteredFirstName,
      lastName: enteredLastName,
      privacy: privacy,
    };

    formData.append(
      "user",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    registar(formData).then(
      (response) => {
        props.setIsLoading(false);
        setConcluded(true);
      },
      (error) => {
        props.setIsLoading(false);
        if (error.status === 400) {
          setInvalidInput(true);
        } else if (error.status === 409) {
          setEmailHasAccount(true);
        } else {
          setError(true);
        }
      }
    );
  };

  const register = (
    <form onSubmit={formSubmissionHandler} className={classes.registForm}>
      <h1 className={classes.registTitle}>Junta-te a Nós</h1>
      <div className={classes.imageUploadDiv}>
        <ImageUpload
          alt="upload-profile"
          selectedFile={selectedFile}
          fileChangeHandler={setSelectedFile}
          isProfile={isProfile}
        />
      </div>
      <div className={classes.usernameDiv}>
        <label htmlFor="username" className={classes.labelForm}>
          Nome de Utilizador
        </label>
        <input
          type="text"
          id="username"
          value={enteredUsername}
          onChange={usernameChangeHandler}
          onBlur={usernameBlurHandler}
        />
        {usernameHasError && (
          <p className={classes.registError}>
            Por favor insira um nome de utilizador.
          </p>
        )}
      </div>
      <div className={classes.privacyDiv}>
        <label htmlFor="public" className={classes.radioLabel}>
          <input
            type="radio"
            id="public"
            value={PUBLIC}
            onChange={privacyChangeHandler}
            checked={privacy === PUBLIC}
          />
          Público
        </label>
        <label htmlFor="private" className={classes.radioLabel}>
          <input
            type="radio"
            id="private"
            value={PRIVATE}
            onChange={privacyChangeHandler}
            checked={privacy === PRIVATE}
          />
          Privado
        </label>
      </div>
      <div className={classes.passwordDiv}>
        <label htmlFor="password" className={classes.labelForm}>
          Password
        </label>
        <input
          type="password"
          id="password"
          value={enteredPassword}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
        {passwordHasError && (
          <p className={classes.registError}>Por favor insira uma password.</p>
        )}
      </div>
      <div className={classes.confirmDiv}>
        <label htmlFor="confirmation" className={classes.labelForm}>
          Confirmação
        </label>
        <input
          type="password"
          id="confirmation"
          value={enteredConfirmation}
          onChange={confirmationChangeHandler}
          onBlur={confirmationBlurHandler}
        />
        {confirmationHasError && (
          <p className={classes.registError}>
            Por favor insira uma confirmação de password válida.
          </p>
        )}
      </div>
      <div className={classes.firstNameDiv}>
        <label htmlFor="firstName" className={classes.labelForm}>
          Nome
        </label>
        <input
          type="text"
          id="firstName"
          value={enteredFirstName}
          onChange={firstNameChangeHandler}
          onBlur={firstNameBlurHandler}
        />
        {firstNameHasError && (
          <p className={classes.registError}>Por favor insira um nome.</p>
        )}
      </div>
      <div className={classes.lastNameDiv}>
        <label htmlFor="lastName" className={classes.labelForm}>
          Apelido
        </label>
        <input
          type="text"
          id="lastName"
          value={enteredLastName}
          onChange={lastNameChangeHandler}
          onBlur={lastNameBlurHandler}
        />
        {lastNameHasError && (
          <p className={classes.registError}>Por favor insira um apelido.</p>
        )}
      </div>
      <div className={classes.emailDiv}>
        <label htmlFor="email" className={classes.labelForm}>
          Email
        </label>
        <input
          type="text"
          id="email"
          value={enteredEmail}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        {emailHasError && (
          <p className={classes.registError}>Por favor insira um e-mail.</p>
        )}
      </div>
      <div className={classes.buttonDiv}>
        <Button disabled={!formIsValid} text="Registar" />
      </div>
      {invalidInput && (
        <p className={classes.invalidError}>Informação inválida.</p>
      )}
      {emailHasAccount && (
        <p className={classes.invalidError}>
          Uma conta com o mesmo e-mail já está registado no sistema.
        </p>
      )}
      {error && (
        <p className={classes.invalidError}>Por favor tente novamente.</p>
      )}
    </form>
  );

  const registerComplete = (
    <div className={classes.completeDiv}>
      <h1 className={classes.completeTitle}>Registo Completo com Sucesso!</h1>
      <img src={juntosIcon} alt="juntos-icon" className={classes.completeImg} />
      <p className={classes.completeText}>
        Por favor verifique o seu e-mail para ativar a sua conta.
      </p>
    </div>
  );

  const spinner = (
    <div className={classes.spinnerContainer}>
      <LoadingSpinner />
    </div>
  );

  return (
    <Fragment>
      {isLogged && redirectHandler()}
      {!isLogged && !concluded && !props.isLoading && register}
      {!isLogged && concluded && !props.isLoading && registerComplete}
      {props.isLoading && spinner}
    </Fragment>
  );
};

export default Register;

/*
email, username, password, confirmação, foto, se quer perfil publico ou privado + 1º e ultimo nome
obrigatorio: email, username, password, confirmação, 1º e ultimo nome
*/
