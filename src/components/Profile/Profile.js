import { useState } from "react";
import useInput from "../hooks/use-input";
import Button from '..//UI/Button'

const isNotEmpty = (value) => value.trim() !== "";

const Profile = () => {
  const [invalidInput, setInvalidInput] = useState(false);
  const [emailHasAccount, setEmailHasAccount] = useState(false);
  const [error, setError] = useState(false);
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [concluded, setConcluded] = useState(false);

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
        resetPasswordInput();
        resetConfirmationInput();
        resetEmailInput();
        resetUsernameInput();
        resetFirstNameInput();
        resetLastNameInput();
        setPrivacy("PUBLIC");
        //profilePic: data
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
  return <form></form>;
};

export default Profile;
