import { useEffect, useState } from "react";
import useInput from "../hooks/use-input";
import Button from '..//UI/Button'
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import {register} from '../../services/http'

const isNotEmpty = (value) => value.trim() !== "";

const Profile = (props) => {
  const isLogged = useSelector((state) => state.auth.isLogged)
  const authUsername = useSelector((state) => state.auth.username)
  const authToken = useSelector((state) => state.auth.token)
  const authRole = useSelector((state) => state.auth.role)
  const authEmail = useSelector((state) => state.auth.email)

  console.log(isLogged + " " + authUsername + " " + authToken + " " + authRole + " " + authEmail)

  const match = useRouteMatch();

  const [invalidInput, setInvalidInput] = useState(false);
  const [error, setError] = useState(false);
  const [privacy, setPrivacy] = useState("");
  const [concluded, setConcluded] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    setValueHandler: setEmailValueHanlder,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    setValueHandler: setPasswordValueHanlder,
  } = useInput(isNotEmpty);

  const {
    value: enteredConfirmation,
    isValid: enteredConfirmationIsValid,
    hasError: confirmationHasError,
    valueChangeHandler: confirmationChangeHandler,
    inputBlurHandler: confirmationBlurHandler,
    setValueHandler: setConfirmationValueHanlder,
  } = useInput(isNotEmpty);

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    setValueHandler: setFirstNameValueHanlder,
  } = useInput(isNotEmpty);

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    setValueHandler: setLastNameValueHanlder,
  } = useInput(isNotEmpty);

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    setValueHandler: setUsernameValueHanlder,
  } = useInput(isNotEmpty);

  const userId = match.params.username;
  
  useEffect(() => {
    //getUser(userId).then((res) => {}, (error) => {})
  }, [userId])

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

    const formData = {
      email: enteredEmail,
      password: enteredPassword,
      confirmation: enteredConfirmation,
      username: enteredUsername,
      firstName: enteredFirstName,
      lastName: enteredLastName,
      privacy: privacy,
    };

    register(formData).then(
      (response) => {
        //profilePic: data
        setConcluded(true);
      },
      (error) => {
        if (error.status === 400) {
          setInvalidInput(true);
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

  const profile = (
    <form onSubmit={formSubmissionHandler}>
      <h1>Perfil</h1>
      <div>
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
        <Button disabled={!formIsValid} text="Guardar" />
      </div>
    </form>
  );
  
  return (profile);
};

export default Profile;
