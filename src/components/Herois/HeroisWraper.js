//import { useRouteMatch } from "react-router";
import classes from "./HeroisWrapper.module.css";
import Button from "../UI/Button";

import { Link, useRouteMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHero } from "../../services/http";
import { useDispatch } from "react-redux";
import { snackActions } from "../../store/snackBar/snack";
import LoadingSpinner from "../UI/LoadingSpinner";

//ir buscar todos aqui ou em slides?
//ir buscar o do endereço por id

const HeroisWraper = () => {
  const match = useRouteMatch();
  const heroiId = match.params.heroiId;
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    getHero(heroiId).then(
      (response) => {
        setIsLoading(false);
        setResponseData(response.data);
      },
      (error) => {
        setIsLoading(false);
        if (error && error.status === 401) {
        } else {
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
  }, [heroiId]);

  return (
    <div className={classes.container}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      {responseData && (
        <div className={classes.heroiContainer}>
          <h1 className={classes.title}>{responseData.title}</h1>
          <h6 className={classes.name}>
            {responseData.firstName} {responseData.lastName}
          </h6>
          <p className={classes.info}>{responseData.text}</p>
          <img
            src={responseData.img}
            alt="heroi-do-mes"
            className={classes.image}
          />
        </div>
      )}
      <Link to="/HallOfFame" className={classes.slidesContainer}>
        <Button className={classes.seeOthers} text="Ver Outros Heróis" />
      </Link>
    </div>
  );
};

export default HeroisWraper;

//pensar em meter estes props na store ou fazer um Context hook porque estamos a passar varios niveis
