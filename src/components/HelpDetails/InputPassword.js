import { useState } from "react";
import { completeMarker } from "../../services/http";
import useInput from "../hooks/use-input";
import classes from "./InputPassword.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";
import { useDispatch } from "react-redux";

const isNotEmpty = (value) => value.trim() !== "";

const InputPassword = (props) => {
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    value: enteredPass,
    isValid: enteredPassIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const passwordSubmitHandler = (event) => {
    event.preventDefault();

    if (!enteredPassIsValid || rating <= 0) {
      return;
    }

    setIsLoading(true);

    completeMarker(props.markerId, enteredPass, rating).then(
      (response) => {
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
        setIsLoading(false);
        if (error.status === 401) {
          alert("Sessão expirou");
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
        }
      }
    );
    //Mandar pass ao server por email ou username
  };

  return (
    <div className={classes.container}>
      <h6 className={classes.title}>
        Concluiste esta ajuda e tens uma password?
      </h6>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <form onSubmit={passwordSubmitHandler} className={classes.passContainer}>
        <label htmlFor="pass" className={classes.labelPass}>
          Insere-a aqui para que conte:
        </label>
        <input
          type="text"
          id="pass"
          value={enteredPass}
          onChange={passChangeHandler}
          onBlur={passBlurHandler}
          className={classes.inputPass}
          disabled={props.isOwner}
        />
        {passHasError && (
          <p className={classes.errorPass}>
            Por favor insere uma password válida
          </p>
        )}
        <span className={classes.rating}>O que achaste da ação?</span>
        <div className={classes.starRating}>
          {[...Array(3)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={index <= rating ? `${classes.on}` : `${classes.off}`}
                onClick={() => setRating(index)}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={passwordSubmitHandler}
          className={classes.buttonPass}
          disabled={props.isOwner}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default InputPassword;
