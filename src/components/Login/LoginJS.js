import useInput from "../hooks/use-input";
import { login, sendRecover, loginExternal } from "../../services/http";
import { Fragment, useState } from "react";
import jwt_decode from "jwt-decode";
import Button from "../UI/Button";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/session/auth";
import backIcon from "../../img/back.png";
import classes from "./LoginJS.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import juntosIcon from "../../img/logo.png";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { snackActions } from "../../store/snackBar/snack";

//out of rendering cycle - functions to verify input
const isEmail = (value) => value.trim().match("^(.+)@(.+)$");
const isPassword = (value) => value.trim().length > 0;

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
  } = useInput(isEmail); //pass func to validate

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(isPassword);

  let formIsValid = false;

  if (enteredEmailIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }
  const failureGoogle = () => {};
  const responseFacebook = (responseG) => {
    if (responseG.status !== "unknown") {
      loginExternal(
        responseG.email,
        responseG.first_name,
        responseG.id,
        responseG.picture.data.url,
        responseG.last_name,
        "FACEBOOK"
      ).then(
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
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "success",
              snackBarMessage: "Login efectuado com sucesso!",
            })
          );
          props.onCloseModal();
        },
        (error) => {
          props.setIsLoading(false);
          if (error.status === 400) {
            setError("Credenciais Inválidas");
            setError("Credênciais inválidas");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Credênciais Inválidas",
              })
            );
          } else if (error.status === 403) {
            setError("Esta conta está desativada");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Esta conta está desativada",
              })
            );
          } else if (error.status === 404) {
            setError("Não existe um utilizador registado com este e-mail");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage:
                  "Não existe um utilizador registado com este e-mail",
              })
            );
          } else {
            setError("Algo Inesperado aconteceu, tente novamente");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage:
                  "Algo inesperado aconteceu, teste novamente se o erro persistir contacte-nos",
              })
            );
          }
        }
      );
    }
  };

  const responseGoogle = (responseG) => {
    if (responseG !== undefined) {
      loginExternal(
        responseG.profileObj.email,
        responseG.profileObj.givenName,
        responseG.profileObj.googleId,
        responseG.profileObj.imageUrl,
        responseG.profileObj.familyName,
        "GOOGLE"
      ).then(
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
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "success",
              snackBarMessage: "Login efectuado com sucesso!",
            })
          );
          props.onCloseModal();
        },
        (error) => {
          props.setIsLoading(false);
          if (error.status === 409) {
            setError("Esta conta já está associada a outra conta juntos");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage:
                  "Esta conta já está associada a outra conta juntos",
              })
            );
          } else if (error.status === 403) {
            setError("Esta conta está desativada");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Esta conta está desativada",
              })
            );
          } else if (error.status === 400) {
            setError("Credênciais inválidas");
            setError("Credênciais inválidas");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Credênciais Inválidas",
              })
            );
          } else if (error.status === 404) {
            setError("Não existe um utilizador registado com este e-mail");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage:
                  "Não existe um utilizador registado com este e-mail",
              })
            );
          } else {
            setError("Algo Inesperado aconteceu, tente novamente");
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage:
                  "Algo inesperado aconteceu, teste novamente se o erro persistir contacte-nos",
              })
            );
          }
        }
      );
    }
  };

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
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "success",
            snackBarMessage: "Login efectuado com sucesso!",
          })
        );
        props.onCloseModal();
      },
      (error) => {
        props.setIsLoading(false);
        if (error.status === 409) {
          setError("Esta conta já está associada a outra conta juntos");
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage:
                "Esta conta já está associada a outra conta juntos",
            })
          );
        } else if (error.status === 403) {
          setError("Esta conta está desativada");
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage: "Esta conta está desativada",
            })
          );
        } else if (error.status === 400) {
          setError("Credênciais inválidas");
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage: "Credênciais Inválidas",
            })
          );
        } else if (error.status === 404) {
          setError("Não existe um utilizador registado com este e-mail");
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage:
                "Não existe um utilizador registado com este e-mail",
            })
          );
        } else {
          setError("Algo Inesperado aconteceu, tente novamente");
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage:
                "Algo inesperado aconteceu, teste novamente se o erro persistir contacte-nos",
            })
          );
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
            <div className={classes.buttonsWrap}>
              <GoogleLogin
                clientId="1087498360674-5pmmlrc59713befeuscgq6g1uo6jmjdn.apps.googleusercontent.com"
                buttonText=""
                onSuccess={responseGoogle}
                onFailure={failureGoogle}
                cookiePolicy={"single_host_origin"}
                className={classes.google}
              />
              <FacebookLogin
                buttonStyle={{
                  width: "40%",
                  height: "80%",
                  borderRadius: "50%",
                  marginLeft: "3em",
                }}
                appId="219276720077809"
                size="small"
                cssClass={classes.facebook}
                fields="first_name, last_name, email, picture"
                callback={responseFacebook}
                icon="fa-facebook"
                textButton=""
              />
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

/*


*/
