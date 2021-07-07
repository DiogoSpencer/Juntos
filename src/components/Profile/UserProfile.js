import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { getUserUsername } from "../../services/http";
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";
import classes from "./UserProfile.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import userIcon from "../../img/userblue.png";
import logoHelps from "../../img/logo.png";

const UserProfile = () => {
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const username = match.params.username;

  useEffect(() => {
    setIsLoading(true);
    getUserUsername(username).then(
      (response) => {
        setResponseData(response.data);
        console.log(response.data);
      },
      (error) => {
        setIsLoading(false);
        if (error.status === 401) {
          alert("Sessão expirou");
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
          history.replace("/home");
        } else {
          console.log(error);
        }
      }
    );
  }, [username]);

  useEffect(() => {
    setIsLoading(false);
  }, [responseData]);

  const formatDate = (longDate) => {
    const date = new Date(longDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

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
            {formatDate(responseData.creationDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
