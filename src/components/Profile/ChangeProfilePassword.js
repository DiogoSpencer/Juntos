import useInput from "../hooks/use-input";
import { changePass } from "../../services/http";
import { Fragment, useState } from "react";
import Button from "../UI/Button";
import { useHistory } from "react-router-dom";
import classes from "./ChangeProfilePassword.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";

//out of rendering cycle - functions to verify input
const isNotEmpty = (value) => value.trim() !== "";

const ChangeProfilePassword = (props) => {
  //fazer isto com useReducer -> muitos state
  const [invalidInput, setInvalidInput] = useState(false);
  const [oldPasswordWrong, setOldPasswordWrong] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const {
    value: enteredOldPassword,
    isValid: enteredOldPasswordIsValid,
    hasError: oldPasswordHasError,
    valueChangeHandler: oldPasswordChangeHandler,
    inputBlurHandler: oldPasswordBlurHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredConfirmation,
    isValid: enteredConfirmationIsValid,
    hasError: confirmationHasError,
    valueChangeHandler: confirmationChangeHandler,
    inputBlurHandler: confirmationBlurHandler,
  } = useInput(isNotEmpty);

  let formIsValid = false;

  let passConfirmed = false;

  if (enteredPassword === enteredConfirmation) {
    passConfirmed = true;
  }

  if (
    enteredPasswordIsValid &&
    enteredConfirmationIsValid &&
    enteredOldPasswordIsValid &&
    passConfirmed
  ) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    setInvalidInput(false);
    setOldPasswordWrong(false);
    setError(false);

    props.setIsLoading(true);

    changePass(enteredOldPassword, enteredPassword, enteredConfirmation).then(
      (response) => {
        props.setIsLoading(false);
        props.onCloseModal();
      },
      (error) => {
        props.setIsLoading(false);
        if (error.status === 400) {
          setInvalidInput(true);
        } else if (error.status === 403) {
          setOldPasswordWrong(true);
        } else if (error.status === 401) {
          alert("Sessão expirou");
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
          history.go(0)
        } else {
          setError(true);
        }
      }
    );
  };

  const spinner = (
    <div className={classes.spinnerContainer}>
      <LoadingSpinner />
    </div>
  );

  const passForm = (
    <div className={classes.mainContainer}>
      <form onSubmit={formSubmissionHandler} className={classes.passForm}>
        <h1 className={classes.formTitle}>Alterar Password</h1>
        <div className={classes.formInputDiv}>
          <label htmlFor="oldPassword" className={classes.formLabelOldPassword}>
            Password Currente
          </label>
          <input
            type="password"
            id="oldPassword"
            value={enteredOldPassword}
            onChange={oldPasswordChangeHandler}
            onBlur={oldPasswordBlurHandler}
            className={classes.formInputOldPassword}
          />
          {oldPasswordHasError && (
            <p className={classes.formError}>
              Por favor insira a sua password currente.
            </p>
          )}
          <label htmlFor="password" className={classes.formLabelPassword}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            className={classes.formInputPassword}
          />
          {passwordHasError && (
            <p className={classes.formError}>
              Por favor insira uma password válida.
            </p>
          )}
          <label htmlFor="confirmation" className={classes.formLabelConfirmation}>
            Confirmação
          </label>
          <input
            type="password"
            id="confirmation"
            value={enteredConfirmation}
            onChange={confirmationChangeHandler}
            onBlur={confirmationBlurHandler}
            className={classes.formInputConfirmation}
          />
          {confirmationHasError && (
            <p className={classes.formError}>
              Por favor insira a confirmação de password.
            </p>
          )}
          {enteredConfirmationIsValid && !passConfirmed && (
            <p className={`${classes.formError} ${classes.confirmationError}`}>
              Confirmação e Password não são iguais
            </p>
          )}
        </div>
        <div className={classes.buttonDiv}>
          <Button disabled={!formIsValid} text={"Alterar"} />
        </div>
        {invalidInput && (
          <p className={`${classes.formError} ${classes.serverError}`}>
            Informação introduzida inválida
          </p>
        )}
        {oldPasswordWrong && (
          <p className={`${classes.formError} ${classes.serverError}`}>
            Password currente está errada.
          </p>
        )}
        {error && (
          <p className={`${classes.formError} ${classes.serverError}`}>
            Por favor tente novamente
          </p>
        )}
      </form>
    </div>
  );

  return (
    <Fragment>
      {!props.isLoading && passForm}
      {props.isLoading && spinner}
    </Fragment>
  );
};

export default ChangeProfilePassword;
