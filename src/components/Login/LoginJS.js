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
  const [invalidInput, setInvalidInput] = useState(false);
  const [accountDisabled, setAccountDisabled] = useState(false);
  const [error, setError] = useState(false);

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
            //profilePic: data
          })
        );
        localStorage.setItem("token", token);
        props.onCloseModal();
        history.push("/home");
      },
      (error) => {
        props.setIsLoading(false);
        if (error.status === 400) {
          setInvalidInput(true);
        } else if (error.status === 403) {
          setAccountDisabled(true);
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
            <p className={classes.formError}>Por favor insira um e-mail.</p>
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
            <p className={classes.formError}>Por favor insira uma password.</p>
          )}
        </div>
        <div className={classes.buttonDiv}>
          <Button disabled={!formIsValid} text={"Entrar"} />
        </div>
        {invalidInput && (
          <p className={`${classes.formError} ${classes.serverError}`}>
            Credenciais inválidas
          </p>
        )}
        {accountDisabled && (
          <p className={`${classes.formError} ${classes.serverError}`}>
            Esta conta está desativada.
          </p>
        )}
        {error && (
          <p className={`${classes.formError} ${classes.serverError}`}>
            Por favor tente novamente
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
