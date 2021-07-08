import { useState } from "react";
import { useSelector } from "react-redux";
import useInput from "../hooks/use-input";
import classes from "./InputPassword.module.css";

const isNotEmpty = (value) => value.trim() !== "";

const InputPassword = (props) => {
  const userEmail = useSelector((state) => state.auth.email);
  const [rating, setRating] = useState(0);

  const {
    value: enteredPass,
    isValid: enteredPassIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredTime,
    isValid: enteredTimeIsValid,
    hasError: timeHasError,
    valueChangeHandler: timeChangeHandler,
    inputBlurHandler: timeBlurHandler,
  } = useInput(isNotEmpty);

  const passwordSubmitHandler = (event) => {
    event.preventDefault();

    if (!enteredPassIsValid) {
      return;
    }
    console.log(enteredPass);
    //Mandar pass ao server por email ou username
  };

  return (
    <div className={classes.container}>
      <h6 className={classes.title}>
        Concluiste esta ajuda e tens uma password?
      </h6>
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
        <label htmlFor="time" className={classes.labelTime}>
          Quantos minutos demoraste a concluir esta ação?
        </label>
        <input
          type="text"
          id="time"
          value={enteredTime}
          onChange={timeChangeHandler}
          onBlur={timeBlurHandler}
          className={classes.inputTime}
          disabled={props.isOwner}
        />
        {timeHasError && (
          <p className={classes.errorPass}>
            Por favor insere um tempo médio de conclusão maior que 0
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
