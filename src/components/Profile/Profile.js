import { useEffect, useState } from "react";
import useInput from "../hooks/use-input";
import Button from "..//UI/Button";
import { useDispatch, useSelector } from "react-redux";
//import { useRouteMatch } from "react-router";
import { getUser, changeCreds, deleteUser } from "../../services/http";
import keyIcon from "../../img/key.png";
import classes from "./Profile.module.css";
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";
import { useHistory } from "react-router";
import ImageUpload from "../Registration/ImageUpload";
import logoIcon from "../../img/logo.png";
import PassModal from "./PassModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import verifiedIcon from "../../img/verified.png";

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const isProfile = true;
let initialTopics = [];
const isNotEmpty = (value) => value.trim() !== "";
const interests = ["HELP_OFFER", "HELP_REQUEST", "DONATE", "ACTION"];
const showInterest = ["Ofertas Ajuda", "Pedidos Ajuda", "Doações", "Ações"];

const Profile = () => {
  const authEmail = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  const history = useHistory();
  //const match = useRouteMatch();

  const [responseData, setResponseData] = useState([]);
  const [invalidInput, setInvalidInput] = useState(false);
  const [error, setError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [privacy, setPrivacy] = useState(PUBLIC);
  const [numHelps, setNumHelps] = useState("0");
  const [creationDate, setCreationDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckedInterest, setIsCheckedInterest] = useState(
    new Array(interests.length).fill(false)
  );

  const {
    value: enteredEmail,
    hasError: emailHasError,
    setValueHandler: setEmailValueHandler,
  } = useInput(isNotEmpty); //pass func to validate

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    setValueHandler: setFirstNameValueHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    setValueHandler: setLastNameValueHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredUsername,
    hasError: usernameHasError,
    setValueHandler: setUsernameValueHandler,
  } = useInput(isNotEmpty);

  //const userId = match.params.username;

  //queremos so fazer useEffect onMount -> []
  useEffect(() => {
    if (authEmail !== "") {
      setIsLoading(true);

      getUser(authEmail).then(
        (response) => {
          console.log(response.data);
          setResponseData(response.data);
          setUsernameValueHandler(response.data.username);
          setEmailValueHandler(response.data.email);
          setLastNameValueHandler(response.data.lastName);
          setFirstNameValueHandler(response.data.firstName);
          setPrivacy(response.data.privacy);
          setNumHelps(response.data.numHelps);
          const date = new Date(response.data.creationDate);
          setCreationDate(
            `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
          );
          if (response.data.profileImg === undefined) {
            setSelectedFile(null);
          } else {
            setSelectedFile(response.data.profileImg);
          }
          initialTopics = new Array(interests.length).fill(false);
          response.data.favTopics &&
            response.data.favTopics.forEach((interest) => {
              initialTopics[interests.indexOf(interest)] = true;
            });
          setIsCheckedInterest(initialTopics);
        },
        (error) => {
          if (error.status === 401) {
            alert("Sessão expirou");
            dispatch(authActions.logout());
            localStorage.removeItem(gS.storage.token);
            history.replace("/home");
          }
        }
      );
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [authEmail]);

  let formIsValid = false;

  if (
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    (enteredFirstName !== responseData.firstName ||
      enteredLastName !== responseData.lastName ||
      privacy !== responseData.privacy ||
      selectedFile !== responseData.profileImg ||
      JSON.stringify(initialTopics) !== JSON.stringify(isCheckedInterest))
  ) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    setError(false);
    setInvalidInput(false);
    setIsLoading(true);

    const formData = new FormData();
    if (selectedFile !== null) {
      formData.append("profileImg", selectedFile);
    }

    let topics = [];

    for (let i = 0; i < isCheckedInterest.length; i++) {
      if (isCheckedInterest[i]) {
        topics.push(interests[i]);
      }
    }

    const userInfo = {
      firstName: enteredFirstName,
      lastName: enteredLastName,
      privacy,
      favTopics: topics,
    };

    formData.append(
      "creds",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    changeCreds(formData).then(
      (response) => {
        initialTopics = isCheckedInterest;

        setIsLoading(false);
      },
      (error) => {
        if (error.status === 400) {
          setInvalidInput(true);
        } else {
          setError(true);
        }
        setIsLoading(false);
      }
    );
  };

  const privacyChangeHandler = () => {
    if (privacy === PUBLIC) {
      setPrivacy(PRIVATE);
    } else {
      setPrivacy(PUBLIC);
    }
  };

  const openPassModalHandler = () => {
    setIsModalOpen(true);
  };

  const closePassModalHandler = () => {
    setIsModalOpen(false);
  };

  const deleteAccountHandler = () => {
    if (
      window.confirm(
        "Tem a certeza que pretende apagar a sua conta? Esta ação é irreversível."
      )
    ) {
      setIsLoading(true);
      deleteUser(authEmail).then(
        (response) => {
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
          history.replace("/home");
        },
        (error) => {
          if (error.status === 401) {
            alert(
              "Sessão expirou! Efetue login novamente para concluir a operação"
            );
            dispatch(authActions.logout());
            localStorage.removeItem(gS.storage.token);
            history.replace("/home");
          } else {
            console.log(error);
            setDeleteError(true);
          }
        }
      );
      setIsLoading(false);
    }
  };

  const checkedInterestHandler = (position) => {
    const updatedCheckedState = isCheckedInterest.map((interest, index) =>
      index === position ? !interest : interest
    );

    setIsCheckedInterest(updatedCheckedState);
  };

  const profile = (
    <div className={classes.mainContainer}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.profileContainer}>
        <h1 className={classes.title}>Olá {enteredFirstName}</h1>
        <div className={classes.imageDiv}>
          <ImageUpload
            alt="Profile-Image"
            selectedFile={selectedFile}
            fileChangeHandler={setSelectedFile}
            isProfile={isProfile}
          />
          <p>
            <img src={logoIcon} alt="ajudas" className={classes.logo} />
            {numHelps}
          </p>
          <p>
            <span className={classes.juntos}>juntos</span> desde: {creationDate}
          </p>
          {responseData.company && (
            <p>
              <img
                src={verifiedIcon}
                alt="organizacao-verificada"
                className={classes.verified}
              />
              Organização Verificada
            </p>
          )}
        </div>
        <div className={classes.passLink}>
          <div>
            <p className={classes.changePass}>Alterar Password</p>
            <img
              src={keyIcon}
              alt="change-password"
              className={classes.keyIcon}
              onClick={openPassModalHandler}
            />
            {isModalOpen && <PassModal onClose={closePassModalHandler} />}
          </div>
          <div>
            <span
              onClick={deleteAccountHandler}
              className={classes.deleteButton}
            >
              Apagar Conta
            </span>
            {deleteError && (
              <p className={classes.deleteError}>
                Erro inesperado, por favor tente novamente
              </p>
            )}
          </div>
        </div>
        <form
          onSubmit={formSubmissionHandler}
          className={classes.formContainer}
        >
          <div className={classes.emailDiv}>
            <label htmlFor="email_profile">Email</label>
            <input
              readOnly
              disabled
              type="text"
              id="email_profile"
              value={enteredEmail}
            />
            {emailHasError && <p>Por favor insira um e-mail.</p>}
          </div>
          <div className={classes.usernameDiv}>
            <label htmlFor="username">Nome de Utilizador</label>
            <input
              readOnly
              disabled
              type="text"
              id="username"
              value={enteredUsername}
            />
            {usernameHasError && <p>Por favor insira um nome de utilizador.</p>}
          </div>

          <div className={classes.firstNameDiv}>
            <label htmlFor="firstName">Nome</label>
            <input
              type="text"
              id="firstName"
              value={enteredFirstName}
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
            />
            {firstNameHasError && <p>Por favor insira um nome.</p>}
          </div>
          <div className={classes.lastNameDiv}>
            <label htmlFor="lastName">Apelido</label>
            <input
              type="text"
              id="lastName"
              value={enteredLastName}
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
            />
            {lastNameHasError && <p>Por favor insira um apelido.</p>}
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
          <div className={classes.interestDiv}>
            <h3 className={classes.subTitle}>Interesses</h3>
            <ul className={classes.interestList}>
              {interests.map((interest, index) => {
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
          <div className={classes.buttonContainer}>
            <Button disabled={!formIsValid} text="Guardar" />
          </div>
          {invalidInput && (
            <p className={classes.invalidError}>Informação inválida.</p>
          )}
          {error && (
            <p className={classes.invalidError}>Por favor tente novamente.</p>
          )}
        </form>
        )
      </div>
    </div>
  );

  return profile;
};

export default Profile;
