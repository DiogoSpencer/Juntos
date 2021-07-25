import useInput from "../hooks/use-input";
import { changePass } from "../../services/http";
import { Fragment, useState } from "react";
import Button from "../UI/Button";
import { useHistory } from "react-router-dom";
import classes from "./ChangeProfilePassword.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useDispatch } from "react-redux";
import { snackActions } from "../../store/snackBar/snack";

//out of rendering cycle - functions to verify input
const isPassword = (value) =>
  value.trim().match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$");

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
  } = useInput(isPassword);

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(isPassword); //pass func to validate

  const {
    value: enteredConfirmation,
    isValid: enteredConfirmationIsValid,
    hasError: confirmationHasError,
    valueChangeHandler: confirmationChangeHandler,
    inputBlurHandler: confirmationBlurHandler,
  } = useInput(isPassword);

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
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "success",
            snackBarMessage: "Password modificada com sucesso!",
          })
        );
        props.onCloseModal();
      },
      (error) => {
        props.setIsLoading(false);
        if (error.status === 400) {
          setInvalidInput(true);
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage: "Password inserida inválida.",
            })
          );
        } else if (error && error.status === 403) {
          setOldPasswordWrong(true);
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage: "A password antiga está incorrecta.",
            })
          );
        } else if (error && error.status !== 401) {
          setError(true);
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage:
                "Algo inesperado aconteceu, por favor tenta novamente. Se o error persistir contacta-nos",
            })
          );
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
            minLength={4}
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
            minLength={4}
          />
          {passwordHasError && (
            <p className={classes.formError}>
              Password tem de conter pelo menos 4 carácteres, uma letra
              maiúscula, uma minúscula e um número.
            </p>
          )}
          <label
            htmlFor="confirmation"
            className={classes.formLabelConfirmation}
          >
            Confirmação
          </label>
          <input
            type="password"
            id="confirmation"
            value={enteredConfirmation}
            onChange={confirmationChangeHandler}
            onBlur={confirmationBlurHandler}
            className={classes.formInputConfirmation}
            minLength={4}
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
