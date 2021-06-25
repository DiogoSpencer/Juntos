import useInput from "../hooks/use-input";
import { login } from "../../services/http";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import Button from "../UI/Button";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/session/auth";
import { Link } from "react-router-dom";
import Modal from "../UI/Modal";
import closeIcon from "../../img/closered.png";
import classes from "./LoginJS.module.css";

//out of rendering cycle - functions to verify input
const isNotEmpty = (value) => value.trim() !== "";

const Login = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

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

    login(enteredEmail, enteredPassword).then(
      (response) => {
        const token = response.headers.authorization;
        const parsedToken = jwt_decode(token);
        console.log(parsedToken);
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
    );
  };

  return (
    <Modal onClose={props.onClose}>
      <div className={classes.mainContainer}>
        <img
          src={closeIcon}
          alt="close"
          onClick={props.onClose}
          className={classes.closeIcon}
        />
        <form onSubmit={formSubmissionHandler} className={classes.loginForm}>
          <h1 className={classes.formTitle}>Login</h1>
          {invalidInput && (
            <p className={classes.formError}>Credenciais inválidas</p>
          )}
          {accountDisabled && (
            <p className={classes.formError}>Esta conta está desativada.</p>
          )}
          {error && (
            <p className={classes.formError}>Por favor tente novamente</p>
          )}
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
              type="text"
              id="password"
              value={enteredPassword}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              className={classes.formInputPass}
            />
            {passwordHasError && (
              <p className={classes.formError}>
                Por favor insira uma password.
              </p>
            )}
          </div>
          <div className={classes.buttonDiv}>
            <Button disabled={!formIsValid} text={"Entrar"} />
          </div>
        </form>
        <Link to="/registar" className={classes.registerLink}>
          Registar
        </Link>
        <Link to="/home" className={classes.homeLink}>
          Recuperar Password
        </Link>
      </div>
    </Modal>
  );
};

export default Login;
