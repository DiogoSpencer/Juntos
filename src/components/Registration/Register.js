import { useState } from "react";
import useInput from "../hooks/use-input";
import Button from "../UI/Button";
import ImageUpload from "./ImageUpload";
import { register as registar } from "../../services/http";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Register.module.css";
import juntosIcon from "../../img/logo.png";

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const isProfile = false;

const isName = (value) => value.trim().length >= 2 && value.trim().length <= 13;
const isEmail = (value) => value.trim().match("^(.+)@(.+)$");
const isPassword = (value) =>
  value.trim().match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$");

const interests = ["HELP_OFFER", "HELP_REQUEST", "DONATE", "ACTION"];
const showInterest = ["Ofertas Ajuda", "Pedidos Ajuda", "Doações", "Ações"];
//TODO: #3 Verify if image is one of these types
//TODO: #4 Restrict image size

const Register = (props) => {
  //TODO: #2 Fazer useReducer para isto tudo..
  const [invalidInput, setInvalidInput] = useState(false);
  const [emailHasAccount, setEmailHasAccount] = useState(false);
  const [error, setError] = useState(false);
  const [privacy, setPrivacy] = useState(PUBLIC);
  const [concluded, setConcluded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCompany, setIsCompany] = useState(false);
  const [isCheckedInterest, setIsCheckedInterest] = useState(
    new Array(interests.length).fill(false)
  );

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

  const {
    value: enteredConfirmation,
    isValid: enteredConfirmationIsValid,
    hasError: confirmationHasError,
    valueChangeHandler: confirmationChangeHandler,
    inputBlurHandler: confirmationBlurHandler,
  } = useInput(isPassword);

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(isName);

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(isName);

  const privacyChangeHandler = () => {
    if (privacy === PUBLIC) {
      setPrivacy(PRIVATE);
    } else {
      setPrivacy(PUBLIC);
    }
  };

  const checkChangeHandler = () => {
    setIsCompany((prevState) => !prevState);
  };

  const checkedInterestHandler = (position) => {
    const updatedCheckedState =
      isCheckedInterest &&
      isCheckedInterest.length > 0 &&
      isCheckedInterest.map((interest, index) =>
        index === position ? !interest : interest
      );

    setIsCheckedInterest(updatedCheckedState);
  };

  let formIsValid = false;

  let passConfirmed = false;

  if (enteredPassword === enteredConfirmation) {
    passConfirmed = true;
  }

  if (
    enteredEmailIsValid &&
    enteredPasswordIsValid &&
    enteredConfirmationIsValid &&
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    passConfirmed
  ) {
    formIsValid = true;
  }

  let topics = [];

  for (let i = 0; i < isCheckedInterest.length; i++) {
    if (isCheckedInterest[i]) {
      topics.push(interests[i]);
    }
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    props.setIsLoading(true);

    setInvalidInput(false);
    setEmailHasAccount(false);
    setError(false);

    const formData = new FormData();
    if (selectedFile !== null) {
      formData.append("profileImg", selectedFile);
    }

    const userInfo = {
      email: enteredEmail,
      password: enteredPassword,
      confirmation: enteredConfirmation,
      firstName: enteredFirstName,
      lastName: enteredLastName,
      privacy,
      company: isCompany,
      favTopics: topics,
    };

    formData.append(
      "user",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    registar(formData).then(
      (response) => {
        props.setIsLoading(false);
        setConcluded(true);
      },
      (error) => {
        props.setIsLoading(false);
        if (error.status === 400) {
          setInvalidInput(true);
        } else if (error.status === 409) {
          setEmailHasAccount(true);
        } else {
          setError(true);
        }
      }
    );
  };

  const register = (
    <form onSubmit={formSubmissionHandler} className={classes.registForm}>
      <h1 className={classes.registTitle}>Junta-te a Nós</h1>
      <div className={classes.imageUploadDiv}>
        <ImageUpload
          alt="upload-profile"
          selectedFile={selectedFile}
          fileChangeHandler={setSelectedFile}
          isProfile={isProfile}
        />
      </div>
      <div className={classes.privacyDiv}>
        <label htmlFor="public" className={classes.radioLabel}>
          <input
            type="radio"
            id="public"
            value={PUBLIC}
            onChange={privacyChangeHandler}
            checked={privacy === PUBLIC}
          />
          Público
        </label>
        <label htmlFor="private" className={classes.radioLabel}>
          <input
            type="radio"
            id="private"
            value={PRIVATE}
            onChange={privacyChangeHandler}
            checked={privacy === PRIVATE}
          />
          Privado
        </label>
      </div>
      <div className={classes.passwordDiv}>
        <label htmlFor="password" className={classes.labelForm}>
          Password
        </label>
        <input
          type="password"
          id="password"
          value={enteredPassword}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          minLength={4}
        />
        {passwordHasError && (
          <p className={classes.registError}>
            Password tem de ter minimo 4 caracteres uma maiúscula, uma minúscula
            e um número.
          </p>
        )}
      </div>
      <div className={classes.confirmDiv}>
        <label htmlFor="confirmation" className={classes.labelForm}>
          Confirmação
        </label>
        <input
          type="password"
          id="confirmation"
          value={enteredConfirmation}
          onChange={confirmationChangeHandler}
          onBlur={confirmationBlurHandler}
          minLength={4}
        />
        {confirmationHasError && (
          <p className={classes.registError}>Por favor insira a confirmação.</p>
        )}
        {enteredConfirmationIsValid && !passConfirmed && (
          <p className={classes.registError}>
            Confirmação e Password não são iguais
          </p>
        )}
      </div>
      <div className={classes.firstNameDiv}>
        <label htmlFor="firstName" className={classes.labelForm}>
          Nome
        </label>
        <input
          type="text"
          id="firstName"
          value={enteredFirstName}
          onChange={firstNameChangeHandler}
          onBlur={firstNameBlurHandler}
          minLength={2}
          maxLength={13}
        />
        {firstNameHasError && (
          <p className={classes.registError}>Por favor insira um nome.</p>
        )}
      </div>
      <div className={classes.lastNameDiv}>
        <label htmlFor="lastName" className={classes.labelForm}>
          Apelido
        </label>
        <input
          type="text"
          id="lastName"
          value={enteredLastName}
          onChange={lastNameChangeHandler}
          onBlur={lastNameBlurHandler}
          minLength={2}
          maxLength={13}
        />
        {lastNameHasError && (
          <p className={classes.registError}>Por favor insira um apelido.</p>
        )}
      </div>
      <div className={classes.emailDiv}>
        <label htmlFor="email" className={classes.labelForm}>
          Email
        </label>
        <input
          type="text"
          id="email"
          value={enteredEmail}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          className={classes.emailInput}
          minLength={2}
          maxLength={254}
        />
        {emailHasError && (
          <p className={classes.registError}>Por favor insira um e-mail.</p>
        )}
      </div>
      <div className={classes.companyDiv}>
        <input
          type="checkbox"
          id="company"
          onChange={checkChangeHandler}
          checked={isCompany}
        />
        <label htmlFor="company" className={classes.labelForm}>
          Organização
        </label>
      </div>
      <div className={classes.interestDiv}>
        <h3 className={classes.subTitle}>Tens algum interesse?</h3>
        <ul className={classes.interestList}>
          {interests &&
            interests.length > 0 &&
            interests.map((interest, index) => {
              return (
                <li key={index}>
                  <input
                    type="checkbox"
                    id={`${showInterest[index]}`}
                    value={isCheckedInterest[index]}
                    checked={isCheckedInterest[index]}
                    onChange={() => checkedInterestHandler(index)}
                  />
                  <label
                    htmlFor={`${showInterest[index]}`}
                    className={classes.labelForm}
                  >
                    {showInterest[index]}
                  </label>
                </li>
              );
            })}
        </ul>
      </div>
      {invalidInput && (
        <p className={classes.invalidError}>Informação inválida.</p>
      )}
      {emailHasAccount && (
        <p className={classes.invalidError}>
          Já existe uma conta com este e-mail.
        </p>
      )}
      {error && (
        <p className={classes.invalidError}>Por favor tente novamente.</p>
      )}
      <div className={classes.buttonDiv}>
        <Button disabled={!formIsValid} text="Registar" />
      </div>
    </form>
  );

  const registerComplete = (
    <div className={classes.completeDiv}>
      <h1 className={classes.completeTitle}>Registo Completo com Sucesso!</h1>
      <img src={juntosIcon} alt="juntos-icon" className={classes.completeImg} />
      <p className={classes.completeText}>
        Por favor verifique o seu e-mail para ativar a sua conta.
      </p>
      {isCompany && (
        <p className={classes.organization}>
          A sua conta organizacional irá ficar pendente de aprovação e
          verificação.
        </p>
      )}
    </div>
  );

  const spinner = (
    <div className={classes.spinnerContainer}>
      <LoadingSpinner />
    </div>
  );

  return (
    <div className={classes.mainContainer}>
      {register}
      {concluded && !props.isLoading && registerComplete}
      {props.isLoading && spinner}
    </div>
  );
};

export default Register;

/*
email, username, password, confirmação, foto, se quer perfil publico ou privado + 1º e ultimo nome
obrigatorio: email, username, password, confirmação, 1º e ultimo nome
*/
