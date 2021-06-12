import { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { mapStateToProps } from "../../store/store";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";

const isNotEmpty = (value) => value.trim() !== "";

const Register = (props) => {
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
    value: enteredAddress,
    isValid: enteredAddressIsValid,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
    reset: resetAddressInput,
  } = useInput(isNotEmpty);

  const {
    value: enteredPostalCode,
    isValid: enteredPostalCodeIsValid,
    hasError: postalCodeHasError,
    valueChangeHandler: postalCodeChangeHandler,
    inputBlurHandler: postalCodeBlurHandler,
    reset: resetPostalCodeInput,
  } = useInput(isNotEmpty);

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
    enteredPostalCodeIsValid &&
    enteredAddressIsValid &&
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

    //Mandar info ao server
    //TODO: img upload: https://codeburst.io/react-image-upload-with-kittens-cc96430eaece

    resetConfirmationInput();
    resetAddressInput();
    resetEmailInput();
    resetFirstNameInput();
    resetLastNameInput();
    resetPasswordInput();
    resetPostalCodeInput();

    redirectHandler();
  };

  const register = (
    <form onSubmit={formSubmissionHandler}>
      <h1>Registar</h1>
      <div>
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
          <label htmlFor="name">Password Confirmation</label>
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
          <label htmlFor="name">Morada</label>
          <input
            type="text"
            id="address"
            value={enteredAddress}
            onChange={addressChangeHandler}
            onBlur={addressBlurHandler}
          />
          {addressHasError && <p>Por favor insira uma morada.</p>}
        </div>
        <div>
          <label htmlFor="name">Código Postal</label>
          <input
            type="text"
            id="postalCode"
            value={enteredPostalCode}
            onChange={postalCodeChangeHandler}
            onBlur={postalCodeBlurHandler}
          />
          {postalCodeHasError && (
            <p>Por favor insira um código postal no formato: xxxx-xxx.</p>
          )}
        </div>
        <Button disabled={!formIsValid} text="Registar" />
      </div>
    </form>
  );

  return (
    <Fragment>
      {props.isLogged && redirectHandler}
      {!props.isLogged && register}
    </Fragment>
  );
};

export default connect(mapStateToProps)(withRouter(Register));
