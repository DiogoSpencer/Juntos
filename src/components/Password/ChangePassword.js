import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import { useHistory, useRouteMatch } from "react-router";
import { recoverPassword } from "../../services/http";
import classes from "./ChangePassword.module.css";
import juntosIcon from "../../img/logo.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useState } from "react";

const isPassword = (value) => value.trim().match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$");

const ChangePassword = (props) => {
  const history = useHistory();
  const match = useRouteMatch();
  const urlCode = match.params.code;

  const [isLoading, setIsLoading] = useState(false);

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(isPassword);

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

  if (enteredPasswordIsValid && enteredConfirmationIsValid && passConfirmed) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    recoverPassword(urlCode, enteredPassword, enteredConfirmation).then(
      (response) => {
        setIsLoading(false);
        history.replace("/home");
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
  };
  return (
    <form onSubmit={formSubmissionHandler} className={classes.mainContainer}>
      <h1 className={classes.title}>Alterar Password</h1>
      <img src={juntosIcon} alt="icon-juntos" className={classes.juntosImg} />
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        <div className={classes.passContainer}>
          <label htmlFor="name">Nova Password</label>
          <input
            type="password"
            id="newPassword"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            minLength={4}
          />
          {passwordHasError && (
            <p className={classes.passError}>
              Por favor insira uma nova password válida.
            </p>
          )}
        </div>
        <div className={classes.confirmationContainer}>
          <label htmlFor="name">Confirmação</label>
          <input
            type="password"
            id="confirmation"
            value={enteredConfirmation}
            onChange={confirmationChangeHandler}
            onBlur={confirmationBlurHandler}
            minLength={4}
          />
          {confirmationHasError && (
            <p className={classes.passError}>
              Por favor insira uma confirmação válida.
            </p>
          )}
          {enteredConfirmationIsValid && !passConfirmed && (
            <p className={classes.passError}>
              Confirmação e Password não são iguais
            </p>
          )}
        </div>
        <div className={classes.buttonDiv}>
          <Button
            text="Confirmar"
            disabled={!formIsValid}
            onClick={formSubmissionHandler}
          />
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
