import useInput from "../hooks/use-input";
import { login } from "../../services/http";
import { Fragment, useState } from "react";
import jwt_decode from "jwt-decode";
import Button from "../UI/Button";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/session/auth";
import { Link, useHistory } from "react-router-dom";
import classes from "./LoginJS.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";

//out of rendering cycle - functions to verify input
const isNotEmpty = (value) => value.trim() !== "";

const Login = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  //fazer isto com useReducer -> muitos state
  const [error, setError] = useState(null);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
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

    setError(null);

    props.setIsLoading(true);

    login(enteredEmail, enteredPassword).then(
      (response) => {
        props.setIsLoading(false);
        const token = response.headers.authorization;
        const parsedToken = jwt_decode(token);
        dispatch(
          authActions.login({
            token: token,
            username: parsedToken.username,
            role: parsedToken.role,
            email: parsedToken.email,
          })
        );
        localStorage.setItem("token", token);
        props.onCloseModal();
      },
      (error) => {
        props.setIsLoading(false);
        if (error.status === 400) {
          setError("Credenciais Inválidas")
        } else if (error.status === 403) {
          setError("Esta conta está desativada")
        } else if (error.status === 404) {
          setError("Não existe um utilizador registado com este e-mail")
        } else {
          setError("Algo Inesperado aconteceu, tente novamente");
        }
      }
    );
  };

  const spinner = (
    <div className={classes.spinnerContainer}>
      <LoadingSpinner />
    </div>
  );

  const loginForm = (
    <div className={classes.mainContainer}>
      <form onSubmit={formSubmissionHandler} className={classes.loginForm}>
        <h1 className={classes.formTitle}>Começa a Ajudar</h1>
        <div className={classes.formInputDiv}>
          <label htmlFor="email" className={classes.formLabelEmail}>
            Email
          </label>
          <input
            type="text"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            className={classes.formInputEmail}
          />
          {emailHasError && (
            <p className={`${classes.formError} ${classes.emailError}`}>
              Por favor insira um e-mail.
            </p>
          )}
          <label htmlFor="password" className={classes.formLabelPass}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            className={classes.formInputPass}
          />
          {passwordHasError && (
            <p className={`${classes.formError} ${classes.passError}`}>
              Por favor insira uma password.
            </p>
          )}
        </div>
        <div className={classes.buttonDiv}>
          <Button disabled={!formIsValid} text={"Entrar"} />
        </div>
        {error && (
          <p className={`${classes.formError} ${classes.serverError}`}>
            {error}
          </p>
        )}
      </form>
      <Link to="/home" className={classes.homeLink} onClick={props.onClickLink}>
        Recuperar Password
      </Link>
    </div>
  );

  return (
    <Fragment>
      {!props.isLoading && loginForm}
      {props.isLoading && spinner}
    </Fragment>
  );
};

export default Login;
