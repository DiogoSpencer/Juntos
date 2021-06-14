import { Fragment, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { mapStateToProps } from "../../store/store";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import ImageUpload from "./ImageUpload";
import { register as registar } from "../../services/http";

const isNotEmpty = (value) => value.trim() !== "";
//TODO: #2 fazer os REGEX de verificacao
//TODO: #3 Verify if image is one of these types
//TODO: #4 Restrict image size
const types = ["image/png", "image/jpeg", "image/gif"];

const Register = (props) => {
  //TODO: #2 Fazer useReducer para isto tudo..
  const [invalidInput, setInvalidInput] = useState(false);
  const [emailHasAccount, setEmailHasAccount] = useState(false);
  const [error, setError] = useState(false);
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [concluded, setConcluded] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput(isNotEmpty);

  const {
    value: enteredConfirmation,
    isValid: enteredConfirmationIsValid,
    hasError: confirmationHasError,
    valueChangeHandler: confirmationChangeHandler,
    inputBlurHandler: confirmationBlurHandler,
    reset: resetConfirmationInput,
  } = useInput(isNotEmpty);

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstNameInput,
  } = useInput(isNotEmpty);

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastNameInput,
  } = useInput(isNotEmpty);

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsernameInput,
  } = useInput(isNotEmpty);

  const fileChangeHandler = (event) => {
    const files = event.target.files; //files array
    setFileUpload(true);
    setSelectedFile(files[0]);
  };

  const removeImageHandler = () => {
    setFileUpload(false);
    setSelectedFile(undefined);
  };

  //redirect home if logged - logged users cant register
  const redirectHandler = () => {
    props.history.push("/home");
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
        resetPasswordInput();
        resetConfirmationInput();
        resetEmailInput();
        resetUsernameInput();
        resetFirstNameInput();
        resetLastNameInput();
        setPrivacy("PUBLIC");
        setSelectedFile(undefined);
        setConcluded(true);
      },
      (error) => {
        if (error.status === 400) {
          setInvalidInput(true);
        } else if (error.status === 409) {
          setEmailHasAccount(true);
        } else {
          setError(true);
        }
      }
    );

    //Mandar info ao server
    //TODO: img upload: https://codeburst.io/react-image-upload-with-kittens-cc96430eaece
  };

  const privacyChangeHandler = () => {
    if (!privacy.localeCompare("PUBLIC")) {
      //str1 === str2 -> 0 = false
      setPrivacy("PRIVATE");
    } else {
      setPrivacy("PUBLIC");
    }
  };

  const register = (
    <form onSubmit={formSubmissionHandler}>
      <h1>Registar</h1>
      <div>
        <ImageUpload
          fileUpload={fileUpload}
          removeImageHandler={removeImageHandler}
          selectedFile={selectedFile}
          fileChangeHandler={fileChangeHandler}
        />
        <div>
          <label htmlFor="name">Nome de Utilizador</label>
          <input
            type="text"
            id="username"
            value={enteredUsername}
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
          />
          {usernameHasError && <p>Por favor insira um nome de utilizador.</p>}
        </div>
        <div>
          <label htmlFor="name">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
          />
          {passwordHasError && <p>Por favor insira uma password.</p>}
        </div>
        <div>
          <label htmlFor="name">Confirmação</label>
          <input
            type="password"
            id="confirmation"
            value={enteredConfirmation}
            onChange={confirmationChangeHandler}
            onBlur={confirmationBlurHandler}
          />
          {confirmationHasError && (
            <p>Por favor insira uma confirmação de password válida.</p>
          )}
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
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="firstName"
            value={enteredFirstName}
            onChange={firstNameChangeHandler}
            onBlur={firstNameBlurHandler}
          />
          {firstNameHasError && <p>Por favor insira um nome.</p>}
        </div>
        <div>
          <label htmlFor="name">Apelido</label>
          <input
            type="text"
            id="lastName"
            value={enteredLastName}
            onChange={lastNameChangeHandler}
            onBlur={lastNameBlurHandler}
          />
          {lastNameHasError && <p>Por favor insira um apelido.</p>}
        </div>
        <div>
          <label>
            Privacidade:
            <select value={privacy} onChange={privacyChangeHandler}>
              <option value="PUBLIC">Público</option>
              <option value="PRIVATE">Privado</option>
            </select>
          </label>
        </div>
        <Button disabled={!formIsValid} text="Registar" />
      </div>
    </form>
  );

  const registerComplete = (
    <div>
      <h1>Registo Completo com Sucesso!</h1>
      <img src="" alt="juntos-icon" />
      <p>Por favor verifique o seu e-mail para ativar a sua conta.</p>
    </div>
  );

  return (
    <Fragment>
      {props.isLogged && redirectHandler}
      {!props.isLogged && !concluded && register}
      {!props.isLogged && concluded && registerComplete}
      {invalidInput && <p>Informação inválida.</p>}
      {emailHasAccount && (
        <p>Uma conta com o mesmo e-mail já está registado no sistema.</p>
      )}
      {error && <p>Por favor tente novamente.</p>}
    </Fragment>
  );
};

export default connect(mapStateToProps)(withRouter(Register));

/*
email, username, password, confirmação, foto, se quer perfil publico ou privado + 1º e ultimo nome
obrigatorio: email, username, password, confirmação, 1º e ultimo nome
*/
