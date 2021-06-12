import { withRouter } from "react-router";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";

const isNotEmpty = (value) => value.trim() !== "";

const ChangePassword = (props) => {

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

  let formIsValid = false;

  let passConfirmed = false;

  if (!enteredPassword.localeCompare(enteredConfirmation)) {
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

    //TODO: send to server

    resetPasswordInput();
    resetConfirmationInput();
    props.history.push("/home");
  };
  return (
    <form onSubmit={formSubmissionHandler}>
      <h1>Alterar Password</h1>
      <img src="" alt="icon-juntos" />
      <div>
        <label htmlFor="name">Nova Password</label>
        <input
          type="password"
          id="newPassword"
          value={enteredPassword}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />
        {passwordHasError && <p>Por favor insira uma nova password válida.</p>}
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
          <p>Por favor insira uma confirmação válida.</p>
        )}
      </div>
      <Button text="Confirmar" disabled={!formIsValid} />
    </form>
  );
};

export default withRouter(ChangePassword);
