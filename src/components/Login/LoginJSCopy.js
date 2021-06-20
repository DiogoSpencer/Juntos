import useInput from "../hooks/use-input";
import { login } from "../../services/http";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Button from "../UI/Button";
import { useHistory } from "react-router-dom";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useDispatch } from "react-redux";

//out of rendering cycle - functions to verify input
const isNotEmpty = (value) => value.trim() !== "";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { sendRequest, status, data: response, errorHttp } = useHttp(login);
  //fazer isto com useReducer -> muitos state
  const [invalidInput, setInvalidInput] = useState(false);
  const [accountDisabled, setAccountDisabled] = useState(false);
  const [error, setError] = useState(false);

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

  let formIsValid = false;

  if (enteredEmailIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    sendRequest(enteredEmail, enteredPassword);

    /* login(enteredEmail, enteredPassword).then(
      (response) => {
        const token = response.headers.authorization;
        const parsedToken = jwt_decode(token);
        console.log(parsedToken);
        props.login({
          token: token,
          user: parsedToken.username,
          role: parsedToken.role,
          //profilePic: data
        });
        localStorage.setItem("token", token);
        resetEmailInput();
        resetPasswordInput();
        history.replace("/home"); //nao deixar o user ir para tras
      },
      (error) => {
        if (error.status === 400) {
          setInvalidInput(false);
        } else if (error.status === 403) {
          setAccountDisabled(true);
        } else {
          setError(true);
        }
      }
    ); */
  };

  if (status === "completed" && !errorHttp) {
    const token = response.headers.authorization;
    const parsedToken = jwt_decode(token);
    dispatch(authActions.login({
      token: token,
      username: parsedToken.username,
      role: parsedToken.role,
      //profilePic: data
    }));
    localStorage.setItem("token", token);
    resetEmailInput();
    resetPasswordInput();
    history.replace("/home"); //nao deixar o user ir para tras
  } else if (status === "completed" && errorHttp) {
    if (errorHttp.status === 400) {
      setInvalidInput(false);
    } else if (errorHttp.status === 403) {
      setAccountDisabled(true);
    } else {
      setError(true);
    }
  }

  return (
    <form onSubmit={formSubmissionHandler}>
      {status === "pending" && (
        <div>
          <LoadingSpinner />
        </div>
      )}
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
          {emailHasError && <p>Por favor insira um e-mail.</p>}
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
        <Button disabled={!formIsValid} text={"Entrar"} />
        {invalidInput && <p>Credenciais inválidas</p>}
        {accountDisabled && <p>Esta conta está desativada.</p>}
        {error && <p>Por favor tente novamente</p>}
      </div>
    </form>
  );
};

export default Login;
