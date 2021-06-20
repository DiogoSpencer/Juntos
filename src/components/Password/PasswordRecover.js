import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import { useHistory } from "react-router";

const isNotEmpty = (value) => value.trim() !== "";

const PasswordRecover = (props) => {
  const history = useHistory();

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(isNotEmpty);

  let formIsValid = false;

  if (enteredEmailIsValid) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    //TODO: send to server

    resetEmailInput();
    history.replace("/alterarpassword")
  };

  return (
    <form onSubmit={formSubmissionHandler}>
      <h1>Recuperar Password</h1>
      <img src="" alt="icon-juntos" />
      <div>
        <label htmlFor="name">E-mail</label>
        <input
          type="text"
          id="email"
          value={enteredEmail}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        {emailHasError && <p>Por favor insira um e-mail.</p>}
      </div>
      <Button text="Recuperar" disabled={!formIsValid} />
    </form>
  );
};

export default PasswordRecover;
