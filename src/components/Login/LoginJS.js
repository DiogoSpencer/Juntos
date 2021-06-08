import useInput from "../hooks/use-input";
import { mapStateToProps, mapDispatchToProps } from "../../store/store";
import { login } from "../../services/http";
import { useState } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";

//out of rendering cycle - functions to verify input
const isNotEmpty = (value) => value.trim() !== "";

const Login = (props) => {
  //not very correct to start with true
  //fazer isto com useReducer -> muitos state
  const [validCredentials, setValidCredentials] = useState(true);
  const [accountDisabled, setAccountDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(false)

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: usernameHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetUsernameInput,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput(isNotEmpty);

  let formIsValid = false;

  if (enteredEmailIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    login(enteredEmail, enteredPassword).then(
      (response) => {
        const token = response.headers.authorization;
        const parsedToken = jwt_decode(token);
        console.log(parsedToken)
        props.login({
          token: token,
          user: parsedToken.username,
          role: parsedToken.role,
          //profilePic: data
        });
        localStorage.setItem("token", token);
        setCompleted(true)
      },
      (error) => {
        if (error.status === 400) {
          setValidCredentials(false);
        } else if (error.status === 403) {
          setAccountDisabled(true);
        } else {
          setError(true);
        }
      }
    );
  };

  return (
    <form onSubmit={formSubmissionHandler}>
      <div>
        <h1>Login</h1>
        <div>
          <label htmlFor="name">Email</label>
          <input
            type="text"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {usernameHasError && <p>Por favor insira um e-mail.</p>}
        </div>
        <div>
          <label htmlFor="name">Password</label>
          <input
            type="text"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
          />
          {passwordHasError && <p>Por favor insira uma password.</p>}
        </div>
        <button disabled={!formIsValid}>Submit</button>
        {!validCredentials && <p>Credenciais inválidas</p>}
        {accountDisabled && <p>Esta conta está desativada.</p>}
        {error && <p>Por favor tente novamente</p>}
        {completed && <Redirect to ="/home" />}
      </div>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
