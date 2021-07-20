import useInput from "../hooks/use-input";
import { login, sendRecover, loginExternal } from "../../services/http";
import React, { Fragment, useState } from "react";
import jwt_decode from "jwt-decode";
import Button from "../UI/Button";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/session/auth";
import backIcon from "../../img/back.png";
import classes from "./LoginJS.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import juntosIcon from "../../img/logo.png";
import {GoogleLogin} from "react-google-login";
import FacebookLogin from 'react-facebook-login';

//out of rendering cycle - functions to verify input
const isNotEmpty = (value) => value.trim() !== "";

const Login = (props) => {
  const dispatch = useDispatch();

  //fazer isto com useReducer -> muitos state
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [recoverCompleted, setRecoverCompleted] = useState(false);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
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
            isLogged: true,
            token: token,
            username: parsedToken.username,
            role: parsedToken.role,
            email: parsedToken.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            numHelps: response.data.numHelps,
            profileImg: response.data.profileImg,
          })
        );
        localStorage.setItem("token", token);
        props.onCloseModal();
      },
      (error) => {
        props.setIsLoading(false);
        if (error.status === 400) {
          setError("Credenciais Inválidas");
        } else if (error.status === 403) {
          setError("Esta conta está desativada");
        } else if (error.status === 404) {
          setError("Não existe um utilizador registado com este e-mail");
        } else {
          setError("Algo Inesperado aconteceu, tente novamente");
        }
      }
    );
  };

  const onShowLoginHandler = () => {
    setShowLogin(false);
  };

  const onGoBack = () => {
    setShowLogin(true);
  };

  let recuperateIsValid = false;

  if (enteredEmailIsValid) {
    recuperateIsValid = true;
  }

  const onRecuperateSubmit = (event) => {
    event.preventDefault();

    if (!recuperateIsValid) {
      return;
    }

    setError(null);

    props.setIsLoading(true);

    sendRecover(enteredEmail).then(
      (response) => {
        props.setIsLoading(false);
        setRecoverCompleted(true);
      },
      (error) => {
        props.setIsLoading(false);
        console.log(error);
      }
    );
  };

  const recuperateClass = showLogin ? classes.homeLink : classes.hideLink;

  const spinner = (
    <div className={classes.spinnerContainer}>
      <LoadingSpinner />
    </div>
  );

  const recoverComplete = (
    <div className={classes.completeDiv}>
      <div className={classes.titleContainer}>
        <img
          src={backIcon}
          className={classes.back}
          onClick={onGoBack}
          alt="voltar"
        />
        <h1 className={classes.formTitle}>Sucesso!</h1>
      </div>
      <div className={classes.completeImgDiv}>
        <img
          src={juntosIcon}
          alt="juntos-icon"
          className={classes.completeImg}
        />
        <p className={classes.completeText}>
          Por favor verifique o seu e-mail para recuperar a password.
        </p>
      </div>
    </div>
  );

  const formSubmit = showLogin ? formSubmissionHandler : onRecuperateSubmit;

  const loginForm = (
    <div className={classes.mainContainer}>
      <form onSubmit={formSubmit} className={classes.loginForm}>
        {showLogin ? (
          <Fragment>
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
          </Fragment>
        ) : !recoverCompleted ? (
          <Fragment>
            <div className={classes.titleContainer}>
              <img
                src={backIcon}
                className={classes.back}
                onClick={onGoBack}
                alt="voltar"
              />
              <h1 className={classes.formTitle}>Recuperar Password</h1>
            </div>
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
            </div>
            <div className={classes.buttonDiv}>
              <Button
                disabled={!recuperateIsValid}
                text={"Recuperar"}
                onClick={onRecuperateSubmit}
              />
            </div>
            {error && (
              <p className={`${classes.formError} ${classes.serverError}`}>
                {error}
              </p>
            )}
          </Fragment>
        ) : (
          <Fragment>{recoverComplete}</Fragment>
        )}
      </form>
      <p className={recuperateClass} onClick={onShowLoginHandler}>
        Recuperar Password
      </p>
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