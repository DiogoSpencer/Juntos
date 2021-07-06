import { useSelector } from "react-redux";
import useInput from "../hooks/use-input";
import classes from "./InputPassword.module.css";

const isNotEmpty = (value) => value.trim() !== "";

const InputPassword = () => {
  const userEmail = useSelector((state) => state.auth.email);

  const {
    value: enteredPass,
    isValid: enteredPassIsValid,
    hasError: passHasError,
    valueChangeHandler: passChangeHandler,
    inputBlurHandler: passBlurHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const passwordSubmitHandler = (event) => {
    event.preventDefault();

    if (!enteredPassIsValid) {
      return;
    }
    console.log(enteredPass)
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
        />
        <button
          type="button"
          onClick={passwordSubmitHandler}
          className={classes.buttonPass}
        >
          Submeter
        </button>
      </form>
      {passHasError && (
        <p className={classes.errorPass}>
          Por favor insere uma password válida
        </p>
      )}
    </div>
  );
};

export default InputPassword;
