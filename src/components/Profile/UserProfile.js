import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { getUserUsername } from "../../services/http";
import classes from "./UserProfile.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import userIcon from "../../img/userblue.png";
import logoHelps from "../../img/logo.png";
import verifiedIcon from "../../img/verified.png";
import { useDispatch } from "react-redux";
import { snackActions } from "../../store/snackBar/snack";

const formatDate = (longDate) => {
  const date = new Date(longDate);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const UserProfile = () => {
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const match = useRouteMatch();
  const username = match.params.username;

  useEffect(() => {
    setIsLoading(true);
    getUserUsername(username).then(
      (response) => {
        setIsLoading(false);
        setResponseData(response.data);
      },
      (error) => {
        setIsLoading(false);
        if (error.status === 404) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage: "Utilizador não encontrado.",
            })
          );
        } else if (error && error.status === 400) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage: "Informação inserida inválida",
            })
          );
        } else if (error && error.status !== 401) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage:
                "Algo inesperado aconteceu, por favor tenta novamente. Se o error persistir contacta-nos",
            })
          );
        }
      }
    );
  }, [username]);

  useEffect(() => {
    setIsLoading(false);
  }, [responseData]);

  return (
    <div className={classes.mainContainer}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.profileContainer}>
        <h1 className={classes.title}>
          {responseData.firstName} {responseData.lastName}
        </h1>
        <div className={classes.imageDiv}>
          {responseData.profileImg ? (
            <img
              src={responseData.profileImg}
              className={classes.profileImg}
              alt="foto-perfil"
            />
          ) : (
            <img
              src={userIcon}
              className={classes.profileImg}
              alt="foto-perfil"
            />
          )}
          <p>
            <img src={logoHelps} alt="ajudas" className={classes.logo} />
            {responseData.numHelps}
          </p>
          <p>
            <span className={classes.juntos}>juntos</span> desde:
            {" " + formatDate(responseData.creationDate)}
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
      </div>
    </div>
  );
};

export default UserProfile;
